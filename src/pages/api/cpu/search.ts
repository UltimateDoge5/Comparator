import type { NextApiRequest, NextApiResponse } from "next";
import { AMD_PRODUCTS } from "../../../util/products";
import { Redis } from "@upstash/redis";
import https from "https";

const redis = Redis.fromEnv({
	agent: new https.Agent({ keepAlive: true })
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { manufacturer } = req.query;
	let { model } = req.query;

	if (!model || typeof model !== "string" || model.length < 3) {
		res.status(400).send("Missing model");
		return;
	}

	// Get 5 amd results close to the given model
	if (manufacturer === "amd") {
		model = model.trim().replace(/ /g, "-").toLowerCase();
		if (!model.startsWith("amd-")) model = `amd-${model}`;

		const results = AMD_PRODUCTS.map((p) => p.split("/").pop() as string)
			.filter((p) => p?.includes(model as string))
			.slice(0, 3)
			.map((p) =>
				p?.replace(/-/g, " ")
					.replace("amd", "")
					.replace("r", "R"));

		res.json(results);
		return;
	} else if (manufacturer === "intel") {
		const list = await redis.get<string[]>("intel-cpus");

		if (!list) {
			res.json([]);
			return;
		}

		res.json(list.filter((item) => item.includes(model as string)).slice(0, 3));
		return;
	}

	res.status(400).send("Unknown manufacturer");
};

export default handler;