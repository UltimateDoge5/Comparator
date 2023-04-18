import type { NextApiRequest, NextApiResponse } from "next";
import scrapeAMD from "../../../util/scrapers/amd";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	let { model } = req.query;

	if (!model || typeof model !== "string" || model.length < 3) {
		res.status(400).send("Missing model");
		return;
	}

	model = model.trim().toLowerCase();
	if (!model.startsWith("amd")) model = `amd ${model}`;
	if(model.includes("-")) model = model.replaceAll("-", " ") // One lonely dash can cause issues
	const noCache = req.query["no-cache"] !== undefined;

	let error: { code: number; message: string } | undefined;
	const result = await scrapeAMD(model, noCache).catch((err) => (error = err));

	if (error) return res.status(error.code).send(error.message);
	return res.json(result);
};

export default handler;
