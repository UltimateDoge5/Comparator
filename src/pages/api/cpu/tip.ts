import { AMD_PRODUCTS, INTEL_PRODUCTS } from "../../../util/products";
import { normaliseIntel } from "../../../util/formatting";
import type { NextRequest } from "next/server";

export const config = {
	runtime: "experimental-edge"
};

const handler = async (req: NextRequest) => {
	const { searchParams } = new URL(req.url)
	const manufacturer = searchParams.get("manufacturer");
	let model = searchParams.get("model");

	if (!model  || model.length < 3) {
		return new Response("Missing model", { status: 400 });
	}

	// Get 3 amd results close to the given model
	if (manufacturer === "amd") {
		model = model.trim().replace(/ /g, "-").toLowerCase();
		if (!model.startsWith("amd-")) model = `amd-${model}`;

		const results = AMD_PRODUCTS.map((p) => p.split("/").pop() as string)
			.filter((p) => p?.includes(model as string))
			.slice(0, 3)
			.map((p) => p?.replace(/-/g, " ").replace("amd", "").replace("r", "R").trim());

		return new Response(JSON.stringify(results));
	} else if (manufacturer === "intel") {
		// model = normaliseIntel(model);
		model = model.trim().toLowerCase();
		if(/i\d /i.test(model)) model = model.trim().replace(/(i\d) /i, "$1-");
		return new Response(JSON.stringify(INTEL_PRODUCTS.filter((item) => item.toLowerCase().includes(model as string)).slice(0, 3)));
	}

	return new Response("Unknown manufacturer", { status: 400 });
};

export default handler;
