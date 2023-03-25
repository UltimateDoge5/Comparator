import type { CPU, Manufacturer } from "../../CPU";

const host =
	process.env.NODE_ENV === "production"
		? `https://${process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL}`
		: "http://localhost:3000";

const fetchCPU = async (manufacturer: Manufacturer, model: string, noCache = false) =>
	new Promise<Result>(async (resolve) => {
		const response = await fetch(
			`${host}/api/cpu/${manufacturer.toLowerCase()}?model=${model}&${noCache ? "no-cache" : ""}`
		);

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

export interface Result {
	data: CPU;
	error: {
		text: string;
		code: number;
	} | null;
}

export default fetchCPU;
