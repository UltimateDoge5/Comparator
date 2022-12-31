import type { NextApiRequest, NextApiResponse } from "next";
import type { CheerioAPI } from "cheerio";
import { load } from "cheerio";
import axios from "axios";
import type { CPU } from "../../../../types";
import elementSelector from "../../../util/selectors";
import { prefixes } from "next/dist/build/output/log";
import { parent } from "cheerio/lib/api/traversing";

let $: CheerioAPI;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	let { model } = req.query;

	if (!model || typeof model !== "string" || model.length < 3) {
		res.status(400).send("Missing model");
		return;
	}

	model = model.replace(/ /g, "-").toLowerCase();
	if (!model.startsWith("amd-")) model = `amd-${model}`;

	// Get the url
	//const query =  await fetch("https://www.amd.com/en/products-rest?_format=json")
	// For some dumb reason, this endpoint doesn't work with fetch...
	const query = await axios.get("https://www.amd.com/en/products-rest?_format=json", { timeout: 10000 });

	if (query.status !== 200) {
		console.error(query.statusText);
		res.status(500).end();
		return;
	}

	const list = query.data as { term_id: string; url: string }[];

	const url = list.find((item) => {
		const itemModel = item.url.split("/").pop();
		return itemModel === model;
	})?.url;

	if (!url) {
		res.status(404).send("CPU not found");
		return;
	}

	// Get the product page, and find the link to specs page
	const productPage = await axios.get(`https://www.amd.com${url}`);

	if (productPage.status !== 200) {
		console.error(productPage.statusText);
		res.status(500).send("Error while fetching the product page");
		return;
	}

	$ = load(productPage.data, {
		scriptingEnabled: true
	});


	const specsLink = $(".full_specs_link a").attr("href");

	if (!specsLink) {
		res.status(404).send("Unable to find the specs page");
		return;
	}

	//Get the specs page
	const specsPage = await axios.get(`https://www.amd.com${specsLink}`);

	if (specsPage.status !== 200) {
		console.error(specsPage.statusText);
		res.status(500).send("Error while fetching the specs page");
		return;
	}

	$ = load(specsPage.data);

	const cpu: CPU = {
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
		launchDate: dataToQuarter(new Date(getParameter("Launch Date") || "1970-01-01")),
		memory: {
			type: getParameter("Memory Type"),
			maxSize: getFloatParameter("Max Memory Size (dependent on memory type)")
		},
		graphics: getParameter("Integrated Graphics") === "Yes" ? {
			baseFrequency: getFloatParameter("Graphics Base Frequency"),
			maxFrequency: getFloatParameter("Graphics Max Dynamic Frequency"),
			displays: getFloatParameter("Max # of Displays Supported")
		} : false,
		"64bit": getParameter("64-bit Support") === "Yes",
		pcie: getParameter("PCI Express Revision"),
		source: `https://www.amd.com${specsLink}`
	};

	res.status(200).json(cpu);
};

const getParameter = (name: string) => elementSelector($, ".field__label", name)?.parent().find(".field__item").text().trim() || null;

// AMD doesn't space the values and units, but they set a meta-tag with the value
const getFloatParameter = (name: string) => {
	const item = elementSelector($, ".field__label", name)?.parent().find(".field__item");
	if (!item) return null;

	const value =  parseFloat(item.text().trim());

	if(!value) return parseFloat(item.attr("content") ?? "") * 1e6;

	// Regex for catching the first letter after the numbers
	const regex = /(?<=\d)([a-zA-Z])/g;
	const prefix = item.text().trim().match(regex)?.[0] || "base";

	return value * (Prefixes?.[prefix as keyof typeof Prefixes] ?? 1);
};

const Prefixes = {
	"base": 1,
	"K": 1e4,
	"M": 1e6,
	"G": 1e9
};

const dataToQuarter = (date: Date) => {
	if (date.getFullYear() == 1970) return "Unknown";

	const quarter = Math.floor((date.getMonth() + 1) / 3) + 1;
	return `Q${quarter}'${date.getFullYear().toString().substring(2)}`;
};

export default handler;
