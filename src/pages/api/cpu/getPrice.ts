import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";
import https from "https";

const redis = Redis.fromEnv({
	agent: new https.Agent({ keepAlive: true }),
});

/*
 This is amd only endpoint.
 Intel prices are on the same page as the specs
*/
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	let { model } = req.query;

	if (!model || typeof model !== "string" || model.length < 3) {
		res.status(400).send("Missing model");
		return;
	}

	model = model.toLowerCase().replace(/-/g, " ").replace("amd", "").replace("™", "").trim();

	// Get the price from the shop website
	const response = await fetch(`https://${process.env.BROWSERLESS_URL}/scrape?token=${process.env.BROWSERLESS_TOKEN}`, {
		method: "POST",
		body: JSON.stringify({
				url: `https://www.amd.com/en/shop/us/Desktop%20Processors?keyword=${encodeURI(model)}`,
				"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
				elements: [
					{
						selector: ".shop-price",
					},
				],
			},
		),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.status !== 200) {
		console.error(response.statusText);
		res.status(500).send("Error while fetching the price");
		return;
	}

	const data = await response.json();

	if (data.data?.[0]?.results?.length === 0) {
		res.status(404).send("No price found");
		return;
	}

	//There normally isn't a dollar sign but amd works in mysterious ways
	const price = parseFloat(data.data?.[0]?.results?.[0]?.text.replace("$", ""));

	if (isNaN(price)) {
		res.status(404).send("No price found");
		return;
	}

	await redis.json.set(`amd-${model.replace(/ /g, "-").toLowerCase()}`, "$.MSRP", price);
	return res.status(200).json(price);
};

export default handler;