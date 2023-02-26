import type { NextApiRequest, NextApiResponse } from "next";
import { AMD_PRODUCTS, INTEL_PRODUCTS } from "../../../util/products";
import fetchCPU from "../../../util/fetchCPU";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// q - query
	// p - page
	let { q, p } = req.query as { q: string, p: string };

	p = parseInt(p) < 0 ? "0" : p;
	if (q === undefined) q = "";

	// Get 10 cpus matching the query
	const names = (INTEL_PRODUCTS.concat(AMD_PRODUCTS.map((p => p.toLowerCase().replaceAll("-", " ")))))
		.filter((cpu) => cpu.toLowerCase().includes(q.toLowerCase()))
		.slice((parseInt(p)) * 5, (parseInt(p)) * 5 + 5);

	// let cpus = await Promise.all(names.map((name) => (
	// 	fetchCPU(name.includes("amd") ? "amd" : "intel", name.split("/").pop() as string)
	// )));
	//
	// cpus = cpus.filter((cpu) => {
	// 	if(cpu !== null && cpu.data !== null) return true;
	// 	console.log(cpu?.error);
	// 	return false;
	// });

	res.status(200).json(names.map((name) => ({
		model: name,
		manufacturer: name.includes("amd") ? "amd" : "intel",
	})));
};

export default handler;