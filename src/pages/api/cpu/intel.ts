import type { NextApiRequest, NextApiResponse } from "next";
import type { CheerioAPI } from "cheerio";
import { load } from "cheerio";
import elementSelector from "../../../util/selectors";
import type { CPU } from "../../../../CPU";
import { Redis } from "@upstash/redis";
import * as https from "https";
import type { Memory } from "../../../../CPU";

let $: CheerioAPI;

const redis = Redis.fromEnv({
	agent: new https.Agent({ keepAlive: true }),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { model } = req.query;

	if (!model || typeof model !== "string" || model.length < 3) {
		res.status(400).send("Missing model");
		return;
	}
	// Example: Core i5 or Core
	// In this scenario it will fetch a random processor
	// it makes sense to reject it
	if (/(core[- ]i\d)(?!.)|(core[- ]i\d[- ])(?!.)/gi.test(model.trim().toLowerCase())) {
		res.status(404).send("CPU not found");
		return;
	}

	let cpu: CPU | null =
		req.query["no-cache"] === undefined || process.env.NODE_ENV !== "development"
			? await redis.get(`intel-${model}`)
			: null;

	if (cpu !== null && cpu.schemaVer >= parseFloat(process.env.MIN_SCHEMA_VERSION || "1.1")) {
		res.json(cpu);
		return;
	}

	const token = (await redis.get("intel-token")) ?? (await refreshToken());

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

	if (query.status === 419) {
		const token = await refreshToken();
		query = await fetch("https://platform.cloud.coveo.com/rest/search/v2?f:@tabfilter=[Products]", {
			method: "POST",
			headers: {
				Authorization: token,
			},
			body: JSON.stringify({
				q: model,
				numberOfResults: 1,
			}),
		});
	}

	if (!query.ok) {
		console.error(await query.text());
		res.status(500).end();
		return;
	}

	const data = await query.json();
	let url = data?.results[0]?.uri;

	if (!url) {
		res.status(404).send("CPU not found");
		return;
	}

	// Sometimes the url path is good, but the last part is wrong
	if (!url.includes("specifications")) {
		const temp = url.split("/");
		temp.pop();
		temp.push("specifications");
		url = temp.join("/");
	}

	// Sometimes the search url is from a different language
	if (!url.includes("us/en")) {
		url = url.replace(/www(\/\w{2}\/)(\w{2})/g, "www/us/en");
	}

	if (process.env.NODE_ENV === "development") console.log("Fetching page: ", url);

	// Get the data
	const page = await fetch(url);

	if (!page.ok) {
		console.error(page.statusText, url, model);
		res.status(500).send("Error while fetching the CPU data");
		return;
	}

	$ = load(await page.text());

	let cpuName = getParameter("Processor Number") ?? $(".headline").first().text().trim();
	if (!cpuName?.includes("Intel")) cpuName = "Intel " + cpuName;

	cpu = {
		name: cpuName,
		manufacturer: "intel",
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
		graphics: cpuName?.includes("F")
			? false
			: {
					baseFrequency: getFloatParameter("Graphics Base Frequency"),
					maxFrequency: getFloatParameter("Graphics Max Dynamic Frequency"),
					displays:
						getFloatParameter("Max # of Displays Supported") ??
						getFloatParameter("# of Displays Supported"),
			  },
		pcie: getParameter("PCI Express Revision"),
		source: url,
		schemaVer: 1.1,
	};

	if (process.env.NODE_ENV === "production" || req.query["no-cache"] !== undefined)
		await redis.set(`intel-${model}`, cpu);
	res.status(200).json(cpu);
};

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
			console.log(parseInt(speed.split("/").pop() ?? "0"));

			return { type: type, speed: parseInt(speed.split("/").pop() as string) };
		})
		.filter((mem) => mem?.speed !== null || mem !== null);
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

export default handler;
