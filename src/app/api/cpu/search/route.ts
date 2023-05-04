import { AMD_PRODUCTS, INTEL_PRODUCTS } from "../../../../util/products";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);

	// q - query
	// p - page
	// Can assert types - null checks are still there
	let q = searchParams.get("q") as string;
	let p = searchParams.get("p") as string;

	if (p === null) p = "1";
	const pInt = (parseInt(p) < 1 ? 1 : parseInt(p) - 1); //The app starts at p = 1, but we start at 0
	if (q === null) q = "";

	// Get 5 cpus matching the query
	const names = INTEL_PRODUCTS
		.concat(AMD_PRODUCTS.map((p) => p.name))
		.filter((cpu) => new RegExp(q.trim(), "i").test(cpu));

	const remainingItems = Math.max(names.length - Math.max(pInt, 1) * 5, 0);

	return NextResponse.json({
		names: names.slice(pInt * 5, pInt * 5 + 5).map((name) => ({
			model: beautifyNames(name),
			manufacturer: name.toLowerCase().includes("amd") ? "amd" : "intel",
		})),
		remainingItems,
	});
}

// Make the names look nice
const beautifyNames = (name: string) => {
	const split = name.replace("amd", "AMD").split(" "); // AMD is an exception
	let result = "";
	for (let i = 0; i < split.length; i++) {
		const word = split[i];
		if (word[0] === "i") {
			result += word;
			continue;
		}

		if (word.length > 1) {
			result += word[0].toUpperCase() + word.slice(1) + " ";
		} else {
			result += word.toUpperCase() + " ";
		}
	}
	return result.trim();
};
