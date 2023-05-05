import Comparison from "../components/comparison";
import type { Metadata } from "next";
import type { Selection } from "../components/selector";

export const metadata: Metadata = {
	title: "Compare any CPU you want",
	description: "Comparator lets you compare CPUs and GPUs in an instant!",
	keywords: ["cpu", "compare", "comparator", "intel", "amd", "tool", "app"],
	openGraph: {
		title: "Compare any CPU you want",
		description: "Comparator lets you compare CPUs and GPUs in an instant!",
		url: "https://comparator.pkozak.org",
		type: "website",
		locale: "en_US",
	},
};

// Generate initial selection to prevent a flash of models appearing in the selector
const getInitialSelection = (param: string): Selection => {
	if (param === undefined) return { model: "", manufacturer: "intel", state: "idle" };
	const [manufacturer, model] = splitFirst(param,"-").map((s) => decodeURI(s));
	return { model, manufacturer: manufacturer as "intel" | "amd", state: "loading" };
};

// Split the string on the first appearance of the separator
const splitFirst = (str: string, separator: string) => {
	const index = str.indexOf(separator);
	return [str.substring(0, index), str.substring(index + 1)];
};
export default function Page({ searchParams }: { searchParams: { f: string, s: string } }) {
	return <Comparison f={getInitialSelection(searchParams.f)} s={getInitialSelection(searchParams.s)} />;
}
