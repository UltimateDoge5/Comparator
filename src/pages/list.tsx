import useSWRInfinite from "swr/infinite";
import Footer from "../components/footer";
import Head from "next/head";
import type { CPU, Manufacturer } from "../../CPU";
import Link from "next/link";
import { useRef, useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const List = () => {
	const [query, setQuery] = useState(getQuery());

	const { data, size, setSize, isLoading } = useSWRInfinite<CPU[]>(
		(index) =>
			`/api/cpu/search?q=${query}&p=${index + 1}`,
		fetcher, { keepPreviousData: true },
	);

	return (
		<>
			<Head>
				<title>Search for CPUs | PrimeCPU</title>
				<meta name="description" content="Search for CPUs" />
			</Head>
			<h1 className="absolute top-2 left-2 text-2xl font-bold uppercase italic text-white">
				<Link href="/">PrimeCPU</Link>
			</h1>
			<div className="mt-12 flex min-h-[150vh] w-full flex-col items-center gap-6 text-white">
				<h1 className="text-4xl">Search for CPUs</h1>
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="h-14 w-1/2 rounded-md border border-gray-400 bg-slate-700 p-2 text-xl text-white shadow-lg"
					placeholder="Search for a CPU"
				/>
				<div className="mb-8 flex w-full flex-col items-center gap-6">
					{data?.map((cpu) =>
						cpu.map((cpu) => (
							<div
								key={cpu.name}
								className={`grid h-16 w-1/2 grid-cols-6 grid-rows-1 items-center gap-6 rounded-md border border-slate-600/50 bg-white/5 p-4 transition-colors hover:border-white/50 hover:bg-slate-600/50 ${getManufacturerColor(cpu.manufacturer)} shadow-md`}
							>
								<h1 className="col-span-2 text-2xl">
									<Link href={`/cpu/${cpu.name}`}>{cpu.name}</Link>
								</h1>
								<span style={{ gridArea: "1 / 5 / 2 / 6" }}>{cpu.launchDate}</span>
								<span style={{ gridArea: "1 / 6 / 2 / 7" }}>{cpu.MSRP ? `${cpu.MSRP}$` : "Unavailable"}</span>
							</div>
						)),
					)}
					{isLoading && Array.from({ length: 10 }).fill(1).map((_, i) => (
						<div key={i} className="h-16 w-1/2 animate-pulse rounded-md" />
					))}
				</div>
				<button
					onClick={() => setSize(size + 1)}
					disabled={isLoading}
					className=":focus:ring-offset-slate-900 rounded-md border border-slate-200/20 bg-slate-50/5 px-6 py-2 hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50  dark:text-slate-100"
				>
					Load more
				</button>
			</div>
			<Footer />
		</>
	);
};

const getManufacturerColor = (manufacturer: Manufacturer) => {
	switch (manufacturer) {
		case "amd":
			return "shadow-red-500 hover:bg-red-600/20";
		case "intel":
			return "shadow-blue-500 hover:bg-blue-600/20";
	}
};

const getQuery = () => {
	if (typeof window === "undefined") return "";
	const params = new URLSearchParams(window.location.search);
	return params.get("q") || "";
};

export default List;