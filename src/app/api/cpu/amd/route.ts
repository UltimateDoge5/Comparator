import scrapeAMD from "../../../../util/scrapers/amd";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = "edge";
const redis = Redis.fromEnv()

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	let model = searchParams.get("model");
	const noCache = searchParams.get("no-cache") !== null;

	if (!model || model.length < 3) return new Response("Invalid model", { status: 400 });


	model = model.trim().toLowerCase();
	if (!model.startsWith("amd")) model = `amd ${model}`;
	if (model.includes("-")) model = model.replaceAll("-", " "); // One lonely dash can cause issues

	let error: { code: number; message: string } | undefined;
	const result = await scrapeAMD(redis,model, noCache).catch((err) => (error = err));

	if (error) return new Response(error.message, { status: error.code });
	return NextResponse.json(result);
}

