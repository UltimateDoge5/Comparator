import Comparison from "../components/comparison";
import type { Metadata } from "next";

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

export default function Page() {
	return <Comparison />;
}
