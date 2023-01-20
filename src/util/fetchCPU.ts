import type { CPU, Manufacturer } from "../../CPU";

const fetchCPU = async (manufacturer: Manufacturer, model: string, noCache = false) =>
	new Promise<Result>(async (resolve) => {
		const response = await fetch(
			`/api/cpu/${manufacturer.toLowerCase()}?model=${model}&${noCache ? "no-cache" : ""}`,
		);

		if (!response.ok) {
			// resolve(null response.text() || response.statusText);
			resolve({
				error: {
					text: (await response.text()) || response.statusText,
					code: response.status,
				}, data: {} as CPU,
			});
			return;
		}

		resolve({ data: (await response.json()) as CPU, error: null });
	});

interface Result {
	data: CPU;
	error: {
		text: string;
		code: number;
	} | null;
}

export default fetchCPU;
