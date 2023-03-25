import type { NextApiRequest, NextApiResponse } from "next";
import { AMD_PRODUCTS, INTEL_PRODUCTS } from "../../../util/products";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// q - query
	// p - page
	let { q, p } = req.query as { q: string, p: string };

	p = parseInt(p) < 0 ? "0" : p;
	if (q === undefined) q = "";

	// Get 5 cpus matching the query
	const names = (INTEL_PRODUCTS.concat(AMD_PRODUCTS.map((p => (p.split("/").pop() as string).toLowerCase().replaceAll("-", " ")))))
		.filter((cpu) => cpu.toLowerCase().includes(q.toLowerCase()))
		.slice((parseInt(p)) * 5, (parseInt(p)) * 5 + 5);

	res.status(200).json(names.map((name) => ({
		model: name.replace("amd", "AMD").replace("ryzen", "Ryzen"),
		manufacturer: name.includes("amd") ? "amd" : "intel",
	})));
};

export default handler;