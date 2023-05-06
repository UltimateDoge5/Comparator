import Search from "../../components/search";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Search for a CPU",
	description: "Search for any cpu you want in matter of seconds!",
	keywords: ["cpu", "search", "comparator", "intel", "amd", "tool", "app","list"],
	openGraph: {
		title: "Search for a CPU",
		description: "Search for any cpu you want in matter of seconds!",
		url: "https://prime.pkozak.org",
		type: "website",
		locale: "en_US",
	},
};
const Page = ({ searchParams }: { searchParams: { q: string } }) => {
	return <Search initialQuery={searchParams.q || ""} />;
};

export default Page;
