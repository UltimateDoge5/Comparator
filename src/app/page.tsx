import Comparison from "../components/comparison";
import type { Metadata } from "next";
import type { Selection } from "../components/selector";
import { openGraph, twitter } from "./shared-metadata";
import { beautifyNames, splitFirst } from "../util/formatting";

export const runtime = "edge";

export const generateMetadata = ({ searchParams }: { searchParams: { f: string; s: string } }): Metadata => {
	const [f, s] = [searchParams.f || "", searchParams.s || ""].map((s) => splitFirst(decodeURI(s), "-").pop());

	let title = "Compare any CPU you want";
	let description = "PrimeCPU lets you compare CPUs and GPUs in an instant!";
	let image = "/banner.png";
	if (f !== "" && s !== "") {
		const [fName, sName] = [f, s].map((s) => beautifyNames(s || ""));
		title = `${fName} vs ${sName}`;
		description = `Compare ${fName} and ${sName} in an instant!`;
		image = `/api/banner?f=${searchParams.f}&s=${s}`;
	}

	return {
		title: `${title} | PrimeCPU`,
		description,
		keywords: ["cpu", "compare", "comparator", "intel", "amd", "tool", "app"],
		openGraph: {
			...openGraph,
			images: [
				{
					url: image,
					width: 1200,
					height: 630,
				},
			],
			title: `${title} | PrimeCPU`,
			description,
			url: "https://prime.pkozak.org",
		},
		twitter: {
			...twitter,
			images: [
				{
					url: image,
					width: 1200,
					height: 630,
				},
			],
			title: "Compare any CPU you want",
			description: "PrimeCPU lets you compare CPUs and GPUs in an instant!",
		},
	};
};

// Generate initial selection to prevent a flash of models appearing in the selector
const getInitialSelection = (param: string): Selection => {
	if (param === undefined) return { model: "", manufacturer: "intel", state: "idle" };
	const [manufacturer, model] = splitFirst(param, "-").map((s) => decodeURI(s));
	return { model: beautifyNames(model), manufacturer: manufacturer as "intel" | "amd", state: "loading" };
};

export default function Page({ searchParams }: { searchParams: { f: string; s: string } }) {
	return <Comparison f={getInitialSelection(searchParams.f)} s={getInitialSelection(searchParams.s)} />;
}
