import type { CPU, Manufacturer } from "../../types";

const fetchCPU = async (manufacturer: Manufacturer, model: string) => new Promise<CPU>(async (resolve, reject) => {
	const response = await fetch(`/api/cpu/${manufacturer.toLowerCase()}?model=${model}`);

	if (!response.ok) {
		reject(response.text() || response.statusText);
		return;
	}

	resolve(await response.json());
});

export default fetchCPU;