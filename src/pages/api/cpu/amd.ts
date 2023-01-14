import type { NextApiRequest, NextApiResponse } from "next";
import type { CheerioAPI } from "cheerio";
import { load } from "cheerio";
import axios from "axios";
import type { CPU, Memory } from "../../../../types";
import elementSelector from "../../../util/selectors";
import { Redis } from "@upstash/redis";
import { AMD_PRODUCTS } from "../../../util/products";
import https from "https";

let $: CheerioAPI;

const redis = Redis.fromEnv({
	agent: new https.Agent({ keepAlive: true })
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	let { model } = req.query;

	if (!model || typeof model !== "string" || model.length < 3) {
		res.status(400).send("Missing model");
		return;
	}

	model = model.trim().replace(/ /g, "-").toLowerCase();
	if (!model.startsWith("amd-")) model = `amd-${model}`;

	// Get the cpu from redis
	let cpu: CPU | null = req.query["no-cache"] === undefined ? await redis.get(model) : null;

	if (cpu !== null && cpu.schemaVer >= parseFloat(process.env.MIN_SCHEMA_VERSION || "1.1")) {
		res.json(cpu);
		return;
	}

	const url = AMD_PRODUCTS.find((item) => item.split("/").pop() === model);

	if (!url) {
		res.status(404).send("CPU not found");
		return;
	}

	// Get the product page, and find the link to specs page
	let productPage;

	try {
		productPage = await axios.get(`https://www.amd.com${url}`, {
			timeout: 5000
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("AMD server is not responding");
		return;
	}

	if (productPage.status !== 200) {
		console.error(productPage.statusText);
		res.status(500).send("Error while fetching the product page");
		return;
	}

	$ = load(await productPage.data);

	const specsLink = $(".full_specs_link a").attr("href");

	if (!specsLink) {
		res.status(404).send("Unable to find the specs page");
		return;
	}

	//Get the specs page
	const specsPage = await axios.get(`https://www.amd.com${specsLink}`, { timeout: 4500 });
	if (process.env.NODE_ENV === "development") console.log("Fetching page: ", `https://www.amd.com${specsLink}`);

	if (specsPage.status !== 200) {
		console.error(specsPage.statusText);
		res.status(500).send("Error while fetching the specs page");
		return;
	}

	$ = load(await specsPage.data);

	cpu = {
		name: $(".section-title").text().trim(),
		manufacturer: "amd",
		cores: {
			total: getFloatParameter("# of CPU Cores"),
			performance: null,
			efficient: null
		},
		tdp: getFloatParameter("Default TDP"),
		threads: getFloatParameter("# of Threads"),
		baseFrequency: getFloatParameter("Base Clock"),
		maxFrequency: getFloatParameter("Max. Boost Clock"),
		lithography: getParameter("Processor Technology for CPU Cores"),
		cache: getFloatParameter("L3 Cache"),
		launchDate: getLaunchDate(getParameter("Launch Date") ?? ""),
		memory: {
			types: getMemoryDetails(),
			maxSize: getFloatParameter("Max Memory Size (dependent on memory type)") || getFloatParameter("Max. Memory")
		},
		graphics: getParameter("Integrated Graphics") === "Yes" ? {
			baseFrequency: getFloatParameter("Graphics Base Frequency") ?? getFloatParameter("Graphics Frequency"),
			maxFrequency: getFloatParameter("Graphics Max Dynamic Frequency"),
			displays: getFloatParameter("Max # of Displays Supported")
		} : false,
		pcie: getParameter("PCI Express Revision"),
		source: `https://www.amd.com${specsLink}`,
		schemaVer: 1.1
	};

	if (process.env.NODE_ENV === "production" || req.query["no-cache"] !== undefined) await redis.set(model, cpu);
	res.status(200).json(cpu);
};

const getParameter = (name: string) => elementSelector($, ".field__label", name)?.parent().find(".field__item").text().trim() || null;

// AMD doesn't space the values and units, but they set a meta-tag with the value
const getFloatParameter = (name: string, normalize = true) => {
	const item = elementSelector($, ".field__label", name)?.parent().find(".field__item");
	if (!item) return null;

	const value = parseFloat(item.text().trim());

	if (!value) return parseFloat(item.attr("content") ?? "") * (normalize ? 1e6 : 1);

	// Regex for catching the first letter after the numbers
	const regex = /(?<=\d)([a-zA-Z])/g;
	const prefix = item.text().replaceAll(" ","").match(regex)?.[0] || "base";

	return value * (Prefixes?.[prefix as keyof typeof Prefixes] ?? 1);
};

const Prefixes = {
	"base": 1,
	"K": 1e4,
	"M": 1e6,
	"G": 1e9
};

const getLaunchDate = (string: string) => {
	if (/Q\d \d{4}/.test(string)) return string;

	const date = new Date(string);

	if (date.getFullYear() == 1970) return "Unknown";

	const quarter = Math.floor((date.getMonth() + 1) / 3) + 1;
	return `Q${quarter}'${date.getFullYear().toString().substring(2)}`;
};

const getMemoryDetails = (): Memory["types"] => {
	const memory = getParameter("System Memory Type");
	if (!memory) return [];
console.log(memory);

	// Example:
	// DDR4 - Up to 3200MHz
	// LPDDR4 - Up to 4266MHz
	if (memory?.includes("Up to")) {
		return memory.split("Hz").map((type) => {
			if (!type) return null;
			const [name, speed] = type.split("-");

			return {
				type: name.trim(),
				speed: parseInt(speed.trim().replace("Up to", ""))
			};
		}).filter((type) => type);
	}

	// Example:
	// System Memory Type: DDR4
	// System Memory Specification: Up to 2667MHz
	if (/\d{2}/g.test(memory)) {
		return [
			{
				type: memory,
				speed: getFloatParameter("System Memory Specification", false) as number
			}
		];
	}

	const speeds = elementSelector($, ".field__label", "Max Memory Speed")?.parent().find(".key__values .field .value").text().trim()
	if (!speeds) return [];

	return [
		{
			type: memory,
			speed: parseInt(speeds.split("-").pop() as string)
		}
	]
};

export default handler;
