import type { NextApiRequest, NextApiResponse } from "next";
import type { CheerioAPI } from "cheerio";
import { load } from "cheerio";
import type { CPU, Memory } from "../../../../CPU";
import elementSelector from "../../../util/selectors";
import { Redis } from "@upstash/redis";
import { AMD_PRODUCTS } from "../../../util/products";
import https from "https";
import { normaliseMarket } from "../../../util/formatting";

let $: CheerioAPI;

const redis = Redis.fromEnv({
	agent: new https.Agent({ keepAlive: true }),
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
	let cpu: CPU | null = req.query["no-cache"] === undefined ? (await redis.json.get(model, "$"))[0] : null;
	if (cpu !== null && cpu?.schemaVer >= parseFloat(process.env.MIN_SCHEMA_VERSION || "1.1")) {
		res.json(cpu);
		return;
	}

	const url = AMD_PRODUCTS.find((item) => item.split("/").pop() === model);

	if (!url) {
		res.status(404).send("CPU not found");
		return;
	}

	// Get the product page, and find the link to specs page
	const productPage = await fetch(`https://${process.env.BROWSERLESS_URL}/scrape?token=${process.env.BROWSERLESS_TOKEN}`, {
		method: "POST",
		body: JSON.stringify({
				url: `https://www.amd.com${url}`,
				"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
				elements: [
					{
						selector: ".full_specs_link a",
					},
				],
			},
		),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (productPage.status !== 200) {
		console.error(productPage.statusText);
		res.status(500).send("Error while fetching the product page");
		return;
	}

	const specsLink = (await productPage.json())?.data[0]?.results[0]?.attributes?.find((item: any) => item.name === "href")?.value;

	if (!specsLink) {
		res.status(404).send("Unable to find the specs page");
		return;
	}

	//Get the specs page
	const specsPage = await fetch(`https://${process.env.BROWSERLESS_URL}/content?token=${process.env.BROWSERLESS_TOKEN}`, {
		method: "POST",
		body: JSON.stringify({
			url: `https://www.amd.com${specsLink}`,
			"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (process.env.NODE_ENV === "development") console.log("Fetching page: ", `https://www.amd.com${specsLink}`);

	if (specsPage.status !== 200) {
		console.error(specsPage.statusText);
		res.status(500).send("Error while fetching the specs page");
		return;
	}

	$ = load(await specsPage.text());

	cpu = {
		name: $(".section-title").text().trim(),
		manufacturer: "amd",
		MSRP: null,
		marketSegment: normaliseMarket(getParameter("Platform")),
		cores: {
			total: getFloatParameter("# of CPU Cores"),
			performance: null,
			efficient: null,
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
			maxSize:
				getFloatParameter("Max Memory Size (dependent on memory type)") || getFloatParameter("Max. Memory"),
		},
		graphics:
			getParameter("Integrated Graphics") === "Yes"
			? {
					baseFrequency:
						getFloatParameter("Graphics Base Frequency") ?? getFloatParameter("Graphics Frequency"),
					maxFrequency: getFloatParameter("Graphics Max Dynamic Frequency"),
					displays: getFloatParameter("Max # of Displays Supported"),
				}
			: false,
		pcie: getParameter("PCI Express Revision"),
		source: `https://www.amd.com${specsLink}`,
		ref: "/cpu/" + model,
		schemaVer: 1.2,
	};

	// if (process.env.NODE_ENV === "production" || req.query["no-cache"] !== undefined)
	// amd is appended to the string
	await redis.json.set(model, "$", cpu as Record<string, any>);
	res.status(200).json(cpu);
};

const getParameter = (name: string) =>
	elementSelector($, ".field__label", name)?.parent().find(".field__item").text().trim() || null;

// AMD doesn't space the values and units, but they set a meta-tag with the value
const getFloatParameter = (name: string, normalize = true) => {
	const item = elementSelector($, ".field__label", name)?.parent().find(".field__item");
	if (!item) return null;

	const value = parseFloat(item.text().trim());

	if (!value) return parseFloat(item.attr("content") ?? "") * (normalize ? 1e6 : 1);

	// Regex for catching the first letter after the numbers
	const regex = /(?<=\d)([a-zA-Z])/g;
	const prefix = item.text().replaceAll(" ", "").match(regex)?.[0] || "base";

	return value * (Prefixes?.[prefix as keyof typeof Prefixes] ?? 1);
};

const Prefixes = {
	base: 1,
	K: 1e4,
	M: 1e6,
	G: 1e9,
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

	// Example:
	// DDR4 - Up to 3200MHz
	// LPDDR4 - Up to 4266MHz
	if (memory?.includes("Up to")) {
		return memory
			.split("Hz")
			.map((type) => {
				if (!type) return null;
				const [name, speed] = type.split("-");

				return {
					type: name.trim(),
					speed: parseInt(speed.trim().replace("Up to", "")),
				};
			})
			.filter((type) => type);
	}

	// Example:
	// System Memory Type: DDR4
	// System Memory Specification: Up to 2667MHz
	const speed = getFloatParameter("System Memory Specification", false);
	if (speed) {
		return [
			{
				type: memory,
				speed: speed,
			},
		];
	}

	const speeds = elementSelector($, ".field__label", "Max Memory Speed")?.parent().find(".key__values").text().trim();
	if (!speeds) return [];

	let maxSpeed = 0;

	speeds.match(/DDR\d-(\d{4})/gm)?.forEach((match) => {
		const speed = parseInt(match.split("-")?.pop() ?? "");
		if (speed > maxSpeed) maxSpeed = speed;
	});

	return [
		{
			type: memory,
			speed: maxSpeed,
		},
	];
};

export default handler;
