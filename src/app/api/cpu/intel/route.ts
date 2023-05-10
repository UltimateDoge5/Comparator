import { normaliseIntel } from "../../../../util/formatting";
import scrapeIntel from "../../../../util/scrapers/intel";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv()
export const runtime = "edge";
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const model = searchParams.get("model");
	const noCache = searchParams.get("no-cache") !== null;

	if (!model || model.length < 3) return new Response("Invalid model", { status: 400 });

	// Example: Core i5 or Core
	// In this scenario it will fetch a random processor
	// it makes sense to reject it
	if (
		/(core[- ]i\d)(?!.)|(core[- ]i\d[- ])(?!.)/gi.test(model.trim().toLowerCase()) ||
		model.trim().toLowerCase() === "core"
	) {
		return new Response("Invalid model", { status: 400 });
	}


	let error: { code: number; message: string } | undefined;
	const result = await scrapeIntel(redis,normaliseIntel(model), noCache).catch((err) => (error = err));

	if (error) return new Response(error.message, { status: error.code });
	return NextResponse.json(result);
}
