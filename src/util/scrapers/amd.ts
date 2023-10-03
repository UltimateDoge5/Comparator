import type { CheerioAPI } from "cheerio";
import { load } from "cheerio";
import type { CPU, Memory } from "../../../CPU";
import { AMD_PRICES, AMD_PRODUCTS } from "../products";
import { normaliseMarket } from "../formatting";
import elementSelector from "../selectors";
import type { Redis } from "@upstash/redis";
import { reject, resolve, type ScrapeResult } from "./result";

let $: CheerioAPI;

const scrapeAMD = async (redis: Redis, model: string, noCache: boolean): Promise<ScrapeResult> => {
	if (!noCache) {
		const cache = (await redis.json.get(`amd-${model.replace(/ /g, "-")}`, "$")) as [CPU] | null;
		const cpu = cache?.[0];
		if (cpu !== undefined && cpu?.schemaVer === parseFloat(process.env.MIN_SCHEMA_VERSION)) return resolve({ ...cpu, fromCache: true });
	}

	const url = AMD_PRODUCTS.find((item) => item.name.replace("™", "").toLowerCase() === model)?.url;
	if (!url) {
		console.error("CPU not found:", model);
		return reject({ message: "CPU not found", code: 404 });
	}

	//Get the spec page
	const specsPage = await fetch(`https://${process.env.BROWSERLESS_URL}/content?token=${process.env.BROWSERLESS_TOKEN}`, {
		method: "POST",
		body: JSON.stringify({
			url: url,
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
			gotoOptions: {
				waitUntil: "domcontentloaded",
			},
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (process.env.NODE_ENV === "development") console.log("Fetching page: ", url);

	if (specsPage.status !== 200) {
		console.error("Error:", specsPage.statusText, specsPage.status);
		return reject({ message: "Error while fetching the specs page", code: 500 });
	}

	// This needs to be a global variable, because the getParameter function uses it
	$ = load(await specsPage.text());

	// Get the msrp before model name change
	const msrp = AMD_PRICES[model.replace("amd", "").trim() as keyof typeof AMD_PRICES] || null;
	model = model.replace(/ /g, "-").toLowerCase();
	const name = $(".section-title").text().trim();

	let graphics: false | CPU["graphics"] = false;

	if (getParameter("Integrated Graphics") === "Yes") {
		graphics = {
			baseFrequency:
				getFloatParameter("GPU Base") ?? getFloatParameter("Graphics Base Frequency") ?? getFloatParameter("Graphics Frequency"),
			maxFrequency: getFloatParameter("Graphics Frequency") ?? getFloatParameter("Graphics Max Dynamic Frequency"),
			displays: getFloatParameter("Max Displays") ?? getFloatParameter("Max # of Displays Supported"),
		};
	}
	const cpu: CPU = {
		name,
		manufacturer: "amd",
		MSRP: msrp,
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
			maxSize: getFloatParameter("Max Memory Size (dependent on memory type)") ?? getFloatParameter("Max. Memory"),
		},
		graphics,
		source: url,
		ref: "/cpu/" + model,
		scrapedAt: new Date().toString(),
		schemaVer: parseFloat(process.env.MIN_SCHEMA_VERSION),
	};

	if (process.env.NODE_ENV !== "test" && sumNulls(cpu) < 6) await redis.json.set(model, "$", cpu as unknown as Record<string, unknown>);
	return resolve({ ...cpu, fromCache: false });
};

const getParameter = (name: string) => elementSelector($, ".field__label", name)?.parent().find(".field__item").text().trim() ?? null;

// AMD doesn't space the values and units, but they set a meta-tag with the value
const getFloatParameter = (name: string, normalize = true) => {
	const item = elementSelector($, ".field__label", name)?.parent().find(".field__item");
	if (!item) return null;

	const value = parseFloat(item.text().trim());

	if (!value) return parseFloat(item.attr("content") ?? "") * (normalize ? 1e6 : 1);

	// Regex for catching the first letter after the numbers
	const regex = /(?<=\d)([a-zA-Z])/g;
	const prefix = item.text().replaceAll(" ", "").match(regex)?.[0] ?? "base";

	return value * (Prefixes?.[prefix as keyof typeof Prefixes] ?? 1);
};

const Prefixes = {
	base: 1,
	K: 1e4,
	M: 1e6,
	G: 1e9,
};

const getLaunchDate = (string: string) => {
	if (!string) return "Unknown";
	if (/Q\d \d{4}/.test(string)) return string;

	// Format: 11/5/2020
	const date = new Date(string);
	let month = date.getMonth() + 1;
	let year = date.getFullYear();

	// Format: 7/2020
	// https://www.amd.com/en/product/9936
	if (year == 1970 && /\d\/\d{4}/.test(string)) {
		const dates = string.split("/");
		month = parseInt(dates[0]);
		year = parseInt(dates[1]);
	}

	if (year == 1970) return "Unknown";
	const quarter = Math.floor((month + 2) / 3) + 1;
	return `Q${quarter}'${year.toString().substring(2)}`;
};

export const getMemoryDetails = (testObj?: {
	memory: string | null;
	sysMemSpecs: number | null;
	maxMemSpeeds: string | null;
}): Memory["types"] => {
	const memory = testObj?.memory ?? getParameter("System Memory Type");
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
			.filter((type) => type !== null) as Memory["types"];
	}

	// Example:
	// System Memory Type: DDR4
	// System Memory Specification: Up to 2667MHz
	const speed = testObj?.sysMemSpecs ?? getFloatParameter("System Memory Specification", false);
	if (speed) {
		return [
			{
				type: memory,
				speed,
			},
		];
	}

	const speeds =
		testObj?.maxMemSpeeds ?? elementSelector($, ".field__label", "Max Memory Speed")?.parent().find(".key__values").text().trim();
	if (!speeds) return [];

	// If there is only one type of memory, return it
	if (speeds.split("\n").length === 1) {
		const [type, speed] = speeds.split("-");
		return [
			{
				type,
				speed: parseInt(speed),
			},
		];
	}

	// I don't remember why I did this, but im assuming amd did weird things ¯\_(ツ)_/¯
	const results = speeds.match(/.*DDR\d?.-(\d{4})/gm)?.map((match) => {
		const [type, speed] = match.split("-");
		const speedInt = parseInt(speed);

		return {
			type: type.trim(),
			speed: speedInt,
		};
	});

	// Remove duplicates
	return results?.filter((value, index, self) => self.findIndex((v) => v.type === value.type) === index) ?? [];
};

const sumNulls = (cpu: CPU) => {
	let nulls = 0;
	for (const key in cpu) {
		if (cpu[key as keyof typeof cpu] === null) nulls++;
	}
	return nulls;
};

export default scrapeAMD;
