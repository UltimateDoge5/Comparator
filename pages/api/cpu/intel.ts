import type { NextApiRequest, NextApiResponse } from "next";
import type { CheerioAPI } from "cheerio";
import { load } from "cheerio";

let $: CheerioAPI;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { name } = req.query;

	// Get the url
	const query = await fetch("https://platform.cloud.coveo.com/rest/search/v2?f:@tabfilter=[Products]", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			// Temporary solution for testing
			Authorization: process.env.INTEL_TOKEN as string
		},
		body: JSON.stringify({
			q: name,
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
	console.log("Fetching page: ", url);

	// Sometimes the url path is good, but the last part is wrong
	if (!url.includes("specifications")) {
		const temp = url.split("/");
		temp[temp.length - 1] = "specifications";
		url = temp.join("/");
	}

	// Get the data
	const page = await fetch(url);

	if (!page.ok) {
		console.error(await page.text());
		res.status(500).send("Error while fetching the CPU data");
		return;
	}

	$ = load(await page.text());

	const cpuName = getParameter("Processor Number");

	const cpu = {
		name: cpuName,
		lithography: getParameter("Lithography"),
		cores: {
			total: getFloatParameter("Total Cores"),
			efficient: getFloatParameter("# of Efficient-cores"),
			performance: getFloatParameter("# of Performance-cores")
		},
		threads: getFloatParameter("Total Threads"),
		baseFrequency: getFloatParameter("Processor Base Frequency"),
		maxFrequency: getFloatParameter("Max Turbo Frequency"),
		tdp: getFloatParameter("TDP") || getFloatParameter("Maximum Turbo Power"),
		launchDate: (() => {
			const date = getParameter("Launch Date");

			const [quarter, year] = date?.split("'") ?? [];

			if (!quarter || !year) {
				return null;
			}

			return {
				quarter: quarter.trim(),
				year: parseInt(year.trim())
			};
		})(),
		memory: {
			type:getParameter("Memory Types"),
			// type: (() => {
			// 	const type = getParameter("Memory Types");
			//
			// 	if (!type) {
			// 		return null;
			// 	}
			//
			// 	return type.split("\n").map(t => t.trim());
			// })(),
			maxSize: getFloatParameter("Max Memory Size")
		},
		graphics: cpuName?.includes("F") ? false : {
			baseFrequency: getFloatParameter("Graphics Base Frequency"),
			maxFrequency: getFloatParameter("Graphics Max Dynamic Frequency"),
			directX: getParameter("DirectX* Support"),
			opengl: getParameter("OpenGL* Support"),
			displays: getFloatParameter("Max # of Displays Supported")
		},
		pcie: getParameter("PCI Express Revision"),
		"64bit": getParameter("Instruction Set") === "Yes"
	};

	res.status(200).json(cpu);
};

const getParameter = (name: string) => {
	const selector = $(".tech-label span");
	let label = selector.filter((i, el) => $(el).text() === name);

	if (label.length === 0) {
		label = selector.filter((i, el) => $(el).text().includes(name));
	}

	if (label.length === 0) {
		return null;
	}

	return label.parent().parent().find(".tech-data span").text();
};

const getFloatParameter = (name: string) => {
	const param = getParameter(name)?.split(" ");

	let multiplier: number;
	switch (param?.[1]) {
		case "GHz":
			multiplier = 1e9;
			break;
		case "MHz":
			multiplier = 1e6;
			break;
		case "KHz":
			multiplier = 1e3;
			break;
		default:
			multiplier = 1;
	}

	const floatValue = parseFloat(param?.[0] ?? "") * multiplier;
	return isNaN(floatValue) ? null : floatValue;
};


export default handler;