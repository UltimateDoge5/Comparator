import type { CheerioAPI } from "cheerio";
import { load } from "cheerio";
import type { CPU, Memory } from "../../../CPU";
import { normaliseMarket } from "../formatting";
import elementSelector from "../selectors";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

let $: CheerioAPI;

const scrapeIntel = async (model: string, noCache: boolean) =>
	new Promise<CPU>(async (resolve, reject) => {
		let cpu: CPU | null = !noCache ? (await redis.json.get(`intel-${model.replace(/ /g, "-")}`, "$"))?.[0] : null;

		if (cpu !== null && cpu?.schemaVer >= parseFloat(process.env.MIN_SCHEMA_VERSION || "1.2")) return resolve(cpu);

		const token = (await redis.get<string>("intel-token")) ?? (await refreshToken());

		// Get the url
		let query = await fetch("https://platform.cloud.coveo.com/rest/search/v2?f:@tabfilter=[Products]", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: ("Bearer " + token) as string,
			},
			body: JSON.stringify({
				q: model,
				numberOfResults: 1,
			}),
		});

		if (query.status === 401 || query.status === 419) {
			const token = await refreshToken();
			query = await fetch("https://platform.cloud.coveo.com/rest/search/v2?f:@tabfilter=[Products]", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
				body: JSON.stringify({
					q: model,
					numberOfResults: 1,
				}),
			});
		}

		if (!query.ok) {
			console.error(await query.text());
			return reject({ code: 500, message: "Error while fetching the CPU data" });
		}

		const data = await query.json();
		let url = data?.results[0]?.uri;

		if (!url) return reject({ code: 404, message: "CPU not found" });

		// Sometimes the url path is good, but the last part is wrong
		if (!url.includes("specifications")) {
			const temp = url.split("/");
			temp.pop();
			temp.push("specifications");
			url = temp.join("/");
		}

		// Sometimes the search url is from a different language
		if (!url.includes("us/en")) url = url.replace(/www(\/\w{2}\/)(\w{2})/g, "www/us/en");

		if (process.env.NODE_ENV === "development") console.log("Fetching page: ", url);

		// Get the data
		const page = await fetch(url);

		if (!page.ok) {
			console.error(page.statusText, url, model);
			return reject({ code: 500, message: "Error while fetching the CPU data" });
		}

		$ = load(await page.text());

		let cpuName = getParameter("Processor Number") ?? $(".headline").first().text().trim();
		if (!cpuName?.includes("Intel")) cpuName = "Intel " + cpuName;

		model = model.replace(/ /g, "-").toLowerCase()

		cpu = {
			name: cpuName,
			manufacturer: "intel",
			// MSRP: parseFloat((getParameter("Recommended Customer Price") ?? "null").replace("$", "")),
			MSRP: getPrice(getParameter("Recommended Customer Price")),
			marketSegment: normaliseMarket(getParameter("Vertical Segment")),
			lithography: getParameter("Lithography"),
			cache: getFloatParameter("Cache"),
			cores: {
				total: getFloatParameter("Total Cores"),
				efficient: getFloatParameter("# of Efficient-cores"),
				performance: getFloatParameter("# of Performance-cores"),
			},
			threads: getFloatParameter("Total Threads"),
			baseFrequency:
				getFloatParameter("Processor Base Frequency") || getFloatParameter("Performance-core Base Frequency"),
			maxFrequency: getFloatParameter("Max Turbo Frequency"),
			tdp: getFloatParameter("TDP") || getFloatParameter("Maximum Turbo Power"),
			launchDate: getParameter("Launch Date") as string,
			memory: {
				types: getMemoryDetails(),
				maxSize: getFloatParameter("Max Memory Size"),
			},
			graphics: cpuName?.includes("F") ? false
			                                 : {
					baseFrequency: getFloatParameter("Graphics Base Frequency"),
					maxFrequency: getFloatParameter("Graphics Max Dynamic Frequency"),
					displays:
						getFloatParameter("Max # of Displays Supported") ??
						getFloatParameter("# of Displays Supported"),
				},
			pcie: getParameter("PCI Express Revision"),
			source: url,
			ref: "/cpu/intel-" + model,
			scrapedAt: new Date(),
			schemaVer: 1.2,
		};

		// if (process.env.NODE_ENV === "production" || req.query["no-cache"] !== undefined)
		await redis.json.set(`intel-${model}`, "$", cpu as Record<string, any>);
		return resolve(cpu);
	});

const getParameter = (name: string) =>
	elementSelector($, ".tech-label span", name)?.parent().parent().find(".tech-data span").text() ?? null;

const getFloatParameter = (name: string) => {
	const param = getParameter(name)?.split(" ");

	let multiplier: number;
	switch (param?.[1]?.[0]) {
		case "G":
			multiplier = 1e9;
			break;
		case "M":
			multiplier = 1e6;
			break;
		case "K":
			multiplier = 1e3;
			break;
		default:
			multiplier = 1;
	}

	const floatValue = parseFloat(param?.[0] ?? "") * multiplier;
	return isNaN(floatValue) ? null : floatValue;
};

const getMemoryDetails = (): Memory["types"] => {
	let memory = getParameter("Memory Types");
	if (!memory) return [];

	// Example:
	// Up to DDR5 4800 MT/s
	// Up to DDR4 3200 MT/s
	if (memory.includes("Up to")) {
		return memory
			.replaceAll("Up to", "")
			.split("MT/s")
			.map((mem) => {
				if (!mem) return null;
				const [type, speed] = mem.trim().split(" ");

				return { type: type, speed: parseInt(speed) };
			})
			.filter((mem) => mem !== null);
	}

	memory = memory.replaceAll(/@.*/g, "").replaceAll(", ", ",").trim().replaceAll(" ", "-");

	// DDR4-2133/2400, DDR3L-1333/1600 @ 1.35V
	return memory
		.split(",")
		.map((mem) => {
			const [type, speed] = mem.trim().split("-");

			return { type: type, speed: parseInt(speed.split("/").pop() as string) };
		})
		.filter((mem) => mem?.speed !== null || mem !== null);
};

const getPrice = (s: string | null): number | null => {
	if (s === null) return s;
	s = (s.split("-").pop() as string).replace("$", "");
	return parseFloat(s);
};

export const refreshToken = async () => {
	const token = await fetch("https://www.intel.pl/libs/intel/services/replatform?searchHub=entepriseSearch");

	if (!token.ok) {
		console.error(await token.text());
		return;
	}

	const data = await token.json();
	await redis.set("intel-token", data.token);
	return data.token;
};

export default scrapeIntel;
