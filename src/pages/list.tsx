import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import Footer from "../components/footer";
import Head from "next/head";
import type { CPU, Manufacturer } from "../../CPU";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { capitalize } from "../util/formatting";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const List = () => {
	const [query, setQuery] = useState(getQuery());

	const { data, size, setSize, isLoading } = useSWRInfinite<{ model: string, manufacturer: Manufacturer }[]>(
		(index) =>
			`/api/cpu/search?q=${query}&p=${index + 1}`,
		fetcher, { keepPreviousData: false },
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
			<div className="mt-12 flex min-h-[100vh] w-full flex-col items-center gap-6 text-white">
				<h1 className="text-4xl">Search for CPUs</h1>
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="h-14 w-1/2 rounded-md border border-gray-400 bg-slate-700 p-2 text-xl text-white shadow-lg"
					placeholder="Search for a CPU"
				/>
				<div className="flex w-full flex-col items-center gap-6">
					{data?.map((names, i) => {
						return (
							<Fragment key={i}>
								{names.map((cpu) => (
									<CPUItem key={cpu.model} model={cpu.model} manufacturer={cpu.manufacturer} />
								))}
							</Fragment>
						);
					})}
					{isLoading && Array.from({ length: 5 }).fill(1).map((_, i) => (
						<div key={i} className="h-16 w-1/2 animate-pulse rounded-md bg-gray-800" />
					))}
				</div>
				<button
					onClick={() => setSize(size + 1)}
					disabled={isLoading}
					className="mb-8 rounded-md border border-slate-200/20 bg-slate-50/5 px-6 py-2 text-slate-100 transition-colors hover:bg-slate-100/10 disabled:pointer-events-none disabled:opacity-50"
				>
					Load more
				</button>
			</div>
			<ToastContainer autoClose={2500} position="bottom-left" theme="dark" draggable={false} />
			<Footer />
		</>
	);
};

const CPUItem = ({ model, manufacturer }: { model: string, manufacturer: Manufacturer }) => {
	const { data, error, isLoading, mutate } = useSWR<CPU>(`/api/cpu/${manufacturer}?model=${model}`, fetcher, {});
	const [loadingPrice, setLoadingPrice] = useState(false);

	useEffect(() => {
		(async () => {
			if (data?.manufacturer === "amd" && data.marketSegment === "desktop" && data?.MSRP === null) {
				setLoadingPrice(true);
				const res = await fetch(`/api/cpu/getPrice?model=${model}`);

				if (res.ok) {
					const price = await res.json();
					await mutate({ ...data, MSRP: price });
				}

				setLoadingPrice(false);
			}
		})();
	}, [data]);

	return (
		<div
			key={model}
			className={`grid min-h-[4rem] w-1/2 grid-cols-6 grid-rows-1 items-center gap-6 rounded-md border border-slate-600/50 bg-white/5 p-4
			 transition-colors hover:border-white/50 hover:bg-slate-600/50 ${getManufacturerColor(manufacturer)} shadow-md`}
		>
			<h1 className="col-span-3 text-2xl font-medium">
				<Link href={data?.ref || `/cpu/${model}`}>{model}</Link>
			</h1>

			<span className={isLoading || error ? "flex h-6 w-24 animate-pulse items-center rounded-md bg-gray-800 text-transparent" : ""}>
				{capitalize(data?.marketSegment || "Unknown market")}
			</span>
			<span
				style={{ gridArea: "1 / 5 / 2 / 6" }}
				className={isLoading || error ? "flex h-6 w-24 animate-pulse items-center rounded-md bg-gray-800 text-transparent" : ""}
			>
				{data?.launchDate || ""}
			</span>
			<span
				style={{ gridArea: "1 / 6 / 2 / 7" }}
				className={isLoading || loadingPrice || error ? "flex  h-6 animate-pulse items-center rounded-md bg-gray-800 text-transparent" : ""}
			>
				{data?.MSRP ? `${data.MSRP}$` : "Unavailable"}
			</span>
		</div>
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