import type { CheerioAPI } from "cheerio";

const elementSelector = ($: CheerioAPI, labelClass: string, name: string) => {
	const selector = $(labelClass);
	let label = selector.filter((i, el) => $(el).text() === name);

	if (label.length === 0) {
		label = selector.filter((i, el) => $(el).text().includes(name));
	}

	if (label.length === 0) {
		return null;
	}

	return label;
};

export default elementSelector;