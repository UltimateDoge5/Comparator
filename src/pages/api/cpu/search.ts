import type { NextApiRequest, NextApiResponse } from "next";
import { AMD_PRODUCTS, INTEL_PRODUCTS } from "../../../util/products";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// q - query
	// p - page
	let { q, p } = req.query as { q: string; p: string };

	if (p === undefined) p = "1";
	const pInt = (parseInt(p) < 1 ? 1 : parseInt(p) - 1); //The app starts at p = 1, but we start at 0
	if (q === undefined) q = "";

	// Get 5 cpus matching the query
	const names = INTEL_PRODUCTS
		.concat(AMD_PRODUCTS.map((p) => p.name))
		.filter((cpu) => new RegExp(q.trim(), "i").test(cpu));

	const remainingItems = Math.max(names.length - Math.max(pInt, 1) * 5, 0);

	res.status(200).json({
		names: names.slice(pInt * 5, pInt * 5 + 5).map((name) => ({
			model: beautifyNames(name),
			manufacturer: name.toLowerCase().includes("amd") ? "amd" : "intel",
		})),
		remainingItems,
	});
};

// Make the names look nice
const beautifyNames = (name: string) => {
	const split = name.replace("amd", "AMD").split(" "); // AMD is an exception
	let result = "";
	for (let i = 0; i < split.length; i++) {
		const word = split[i];
		if (word[0] === "i") {
			result += word;
			continue;
		}

		if (word.length > 1) {
			result += word[0].toUpperCase() + word.slice(1) + " ";
		} else {
			result += word.toUpperCase() + " ";
		}
	}
	return result.trim();
};

export default handler;
