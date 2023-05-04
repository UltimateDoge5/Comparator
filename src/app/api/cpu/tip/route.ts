import { AMD_PRODUCTS, INTEL_PRODUCTS } from "../../../../util/products";
import { NextResponse } from "next/server";

export const runtime = "edge";

export  function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const manufacturer = searchParams.get("manufacturer");
	let model = searchParams.get("model");

	if (!model || model.length < 3) return new Response("Missing model", { status: 400 });


	// Get 3 amd results close to the given model
	if (manufacturer === "amd") {
		model = model.trim().toLowerCase();

		const results = AMD_PRODUCTS.map((p) => p.name.toLowerCase())
			.filter((p) => p.replace("™", "")?.includes(model as string))
			.slice(0, 3)
			.map((p) => p.replace("amd", "").replace("r", "R").trim());

		return NextResponse.json(results);
	} else if (manufacturer === "intel") {
		model = model.trim().toLowerCase();
		if (/i\d /i.test(model)) model = model.trim().replace(/(i\d) /i, "$1-");
		return NextResponse.json(INTEL_PRODUCTS.filter((item) => item.toLowerCase().includes(model as string)).slice(0, 3));
	}

	return new Response("Unknown manufacturer", { status: 400 });
}
