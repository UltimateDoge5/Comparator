import type { NextApiRequest, NextApiResponse } from "next";
import { normaliseIntel } from "../../../util/formatting";
import scrapeIntel from "../../../util/scrapers/intel";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { model } = req.query;

	if (!model || typeof model !== "string" || model.length < 3) {
		res.status(400).send("Missing model");
		return;
	}

	// Example: Core i5 or Core
	// In this scenario it will fetch a random processor
	// it makes sense to reject it
	if (
		/(core[- ]i\d)(?!.)|(core[- ]i\d[- ])(?!.)/gi.test(model.trim().toLowerCase()) ||
		model.trim().toLowerCase() === "core"
	) {
		res.status(404).send("CPU not found");
		return;
	}

	const noCache = req.query["no-cache"] !== undefined;

	let error: { code: number; message: string } | undefined;
	const result = await scrapeIntel(normaliseIntel(model), noCache).catch((err) => (error = err));

	if (error) return res.status(error.code).send(error.message);
	return res.json(result);
};

export default handler;
