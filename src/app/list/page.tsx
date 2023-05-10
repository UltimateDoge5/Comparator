import Search from "../../components/search";
import type { Metadata } from "next";
import { openGraph, twitter } from "../shared-metadata";

export const runtime = "edge";

export const metadata: Metadata = {
	title: "Search for a CPU",
	description: "Search for any cpu you want in matter of seconds!",
	keywords: ["cpu", "search", "comparator", "intel", "amd", "tool", "app", "list"],
	openGraph: {
		...openGraph,
		title: "Search for a CPU",
		description: "Search for any cpu you want in matter of seconds!",
		url: "https://prime.pkozak.org/list",
	},
	twitter: {
		...twitter,
		title: "Search for a CPU",
		description: "Search for any cpu you want in matter of seconds!",
	},
};

const Page = ({ searchParams }: { searchParams: { q: string } }) => {
	return <Search initialQuery={searchParams.q || ""} />;
};

export default Page;
