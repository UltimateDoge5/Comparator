import Comparison from "../components/comparison";
import type { Metadata } from "next";
import { openGraph, twitter } from "./shared-metadata";
import { redirect } from "next/navigation";

export const runtime = "edge";

export const metadata: Metadata = {
	title: "Compare any CPU you want | PrimeCPU",
	description: "PrimeCPU lets you compare CPUs and GPUs in an instant!",
	keywords: ["cpu", "compare", "comparator", "intel", "amd", "tool", "app"],
	openGraph: {
		...openGraph,
		title: "Compare any CPU you want | PrimeCPU",
		description: "PrimeCPU lets you compare CPUs and GPUs in an instant!",
		url: "https://prime.pkozak.org",
	},
	twitter: {
		...twitter,
		title: "Compare any CPU you want",
		description: "PrimeCPU lets you compare CPUs and GPUs in an instant!",
	},
};

export default function Page({ params }: { params: { models: string } }) {
	if( params.models !== undefined ) {
		redirect(`/${params.models}`)
	}

	return (
		<Comparison
			models={[
				{ manufacturer: "intel", state: "idle", model: "" },
				{ manufacturer: "intel", state: "idle", model: "" },
			]}
		/>
	);
}
