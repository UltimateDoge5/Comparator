import Search from "../../components/search";

const Page = ({ searchParams }: { searchParams: { q: string } }) => {
	return <Search initialQuery={searchParams.q || ""} />;
};

export default Page;
