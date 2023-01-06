import type { NextApiRequest, NextApiResponse } from "next";
import type { CheerioAPI } from "cheerio";
import { load } from "cheerio";
import elementSelector from "../../../util/selectors";
import type { CPU } from "../../../../types";
// import { writeFile, } from "fs/promises";

let $: CheerioAPI;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { model } = req.query;

	if (!model || typeof model !== "string" || model.length < 3) {
		res.status(400).send("Missing model");
		return;
	}

	// TODO: Cache the token
	const token = await refreshToken();

	// Get the url
	const query = await fetch("https://platform.cloud.coveo.com/rest/search/v2?f:@tabfilter=[Products]", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token as string
		},
		body: JSON.stringify({
			q: model,
			numberOfResults: 1
		})
	});

	if (!query.ok) {
		console.error(await query.text());
		res.status(500).end();
		return;
	}

	const data = await query.json();

	let url = data.results[0].uri;
	// console.log("Fetching page: ", url);

	// Sometimes the url path is good, but the last part is wrong
	if (!url.includes("specifications")) {
		const temp = url.split("/");
		temp[temp.length - 1] = "specifications";
		url = temp.join("/");
	}

	// Get the data
	let page = await fetch(url);

	if (page.status === 419) {
		const token = await refreshToken();
		page = await fetch(url, {
			headers: {
				Authorization: token
			}
		});
	}

	if (!page.ok) {
		console.error(await page.text());
		res.status(500).send("Error while fetching the CPU data");
		return;
	}

	$ = load(await page.text());

	const cpuName = getParameter("Processor Number");

	const cpu: CPU = {
		name: cpuName,
		manufacturer: "intel",
		lithography: getParameter("Lithography"),
		cache: getFloatParameter("Cache"),
		cores: {
			total: getFloatParameter("Total Cores"),
			efficient: getFloatParameter("# of Efficient-cores"),
			performance: getFloatParameter("# of Performance-cores")
		},
		threads: getFloatParameter("Total Threads"),
		baseFrequency:
			getFloatParameter("Processor Base Frequency") || getFloatParameter("Performance-core Base Frequency"),
		maxFrequency: getFloatParameter("Max Turbo Frequency"),
		tdp: getFloatParameter("TDP") || getFloatParameter("Maximum Turbo Power"),
		launchDate: getParameter("Launch Date") as string,
		memory: {
			type: getParameter("Memory Types"),
			maxSize: getFloatParameter("Max Memory Size")
		},
		graphics: cpuName?.includes("F")
		          ? false
		          : {
				baseFrequency: getFloatParameter("Graphics Base Frequency"),
				maxFrequency: getFloatParameter("Graphics Max Dynamic Frequency"),
				displays: getFloatParameter("Max # of Displays Supported")
			},
		pcie: getParameter("PCI Express Revision"),
		"64bit": getParameter("Instruction Set") === "Yes",
		source: url
	};

	res.status(200).json(cpu);
};

const getParameter = (name: string) => elementSelector($, ".tech-label span", name)
	?.parent()
	.parent()
	.find(".tech-data span")
	.text() ?? null;
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

const refreshToken = async () => {
	const token = await fetch("https://www.intel.pl/libs/intel/services/replatform?searchHub=entepriseSearch");

	if (!token.ok) {
		console.error(await token.text());
		return;
	}

	const data = await token.json();
	return data.token;
};

export default handler;