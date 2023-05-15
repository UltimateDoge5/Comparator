import type { CPU, Manufacturer } from "../../CPU";
import { notFound } from "next/navigation";
import scrapeAMD from "./scrapers/amd";
import scrapeIntel from "./scrapers/intel";
import type { Redis } from "@upstash/redis";

const fetchCPU = async (manufacturer: Manufacturer, model: string, noCache = false) =>
	new Promise<Result>(async (resolve) => {
		const response = await fetch(`/api/${manufacturer.toLowerCase()}?model=${model}&${noCache ? "no-cache" : ""}`);

		if (!response.ok) {
			let errorText = await response.text();

			// Sometimes the text is HTML, and we don't want that to be displayed
			if (!errorText || errorText.length > 64) {
				errorText = response.statusText;
			}

			resolve({
				error: {
					text: errorText,
					code: response.status,
				},
				data: {} as CPU,
			});
			return;
		}

		resolve({ data: (await response.json()) as CPU, error: null });
	});

export const fetchCPUEdge = async (redis: Redis, model: string, noCache: boolean): Promise<CPU> => {
	model = model.toLowerCase();
	const manufacturer = model.includes("intel") ? "intel" : model.includes("amd") ? "amd" : undefined;
	// if (process.env.NODE_ENV === "development") console.log(model, manufacturer);

	let error: { code: number; message: string } | undefined;
	let result: CPU;

	if (/(core[- ]i\d)(?!.)|(core[- ]i\d[- ])(?!.)/gi.test(model.trim().toLowerCase()) || model.trim().toLowerCase() === "core") {
		notFound();
	}

	if (manufacturer === "amd") {
		model = model.replace("™", "").replaceAll("-"," ");
		result = await scrapeAMD(redis, model, noCache).catch((err) => (error = err));
	} else {
		result = await scrapeIntel(redis, model, noCache).catch((err) => (error = err));
	}

	if (error?.code === 404) {
		notFound();
	} else if (error?.code) {
		throw new Error(`Error ${error.code}: ${error.message}`, { cause: error });
	}

	return result;
};

export interface Result {
	data: CPU;
	error: {
		text: string;
		code: number;
	} | null;
}

export default fetchCPU;
