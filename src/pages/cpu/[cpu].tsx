import type { CPU } from "../../../CPU";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Footer from "../../components/footer";
import Head from "next/head";
import { capitalize, formatNumber } from "../../util/formatting";
import Navbar from "../../components/navbar";
import { domAnimation, LazyMotion, m, useTime, useTransform } from "framer-motion";
import { ReloadIcon } from "../../components/icons";
import { Fragment, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import scrapeAMD from "../../util/scrapers/amd";
import scrapeIntel from "../../util/scrapers/intel";
import Tooltip from "../../components/tooltip";

// Rolling back again to the node runtime, as edge still behaves weirdly on prod
// export const config = {
// 	runtime: "experimental-edge",
// };

const DateFormat = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "long",
	day: "numeric",
});

const Cpu = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const title = `${data.name} | PrimeCPU`;

	const time = useTime();
	const rotate = useTransform(time, [0, 2000], [0, 360], { clamp: false });
	const [refetch, setRefetch] = useState(false);

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.get("r") === "true") {
			toast.success("CPU data refreshed");
			searchParams.delete("r");
			window.history.replaceState({}, "", window.location.pathname);
		}
	}, []);

	const refreshCPU = async () => {
		setRefetch(true);
		const result = await fetch(`/api/cpu/${data.manufacturer}?model=${data.ref.split("/").pop()}&no-cache`);
		setRefetch(false);

		if (!result.ok) {
			toast.error(result.status === 504 ? "The server is taking too long to respond. Try again later." : await result.text());
			return;
		}

		setTimeout(() => window.location.replace(window.location.href + "?r=true"), 100);
	};

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="description" content={`Here you'll find all the information you need about the ${data.name} processor.`} />
				<meta property="og:title" content={title} />
				<meta
					property="og:description"
					content={`Here you'll find all the information you need about the ${data.name} processor.`}
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`https://comparator.pkozak.org/cpu/${data.name}`} />
			</Head>
			<Navbar />
			<div className="text-white">
				<div className="my-4 flex justify-center gap-4">
					<h1 className="text-3xl">{data.name}</h1>
					<button
						onClick={refreshCPU}
						title="Reload data"
						disabled={data.name === null || refetch}
						className="rounded-md border border-gray-400/20 bg-gray-400/20 p-2 transition-all enabled:cursor-pointer
						 enabled:hover:bg-gray-200/50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<LazyMotion features={domAnimation}>
							<m.div style={{ rotate: refetch ? rotate : 0 }}>
								<ReloadIcon className="h-5 w-5 text-white/60" />
							</m.div>
						</LazyMotion>
					</button>
				</div>
				<div className="mx-auto w-full border-0 border-gray-200/50 bg-white/20 p-4 text-lg md:mb-12 md:w-3/5 md:rounded-md md:border md:p-6">
					<RenderTable cpu={data} list={TableStructure} />
				</div>
				<ToastContainer autoClose={2500} position="bottom-left" theme="dark" draggable={false} />
			</div>
			<Footer />
		</>
	);
};

const RenderTable = ({ cpu, list }: { cpu: CPU; list: Table }) => (
	<Fragment>
		{Object.keys(list)
			// If there is no graphics, don't show the GPU specifications
			.filter((key) => !(cpu.graphics === false && key === "GPU specifications"))
			.map((key, i) => (
				<div key={key}>
					<h2
						className={`relative -left-2 md:-left-4 ${i === 0 ? "mt-2" : "mt-4"} mb-1 border-b
						${cpu.manufacturer === "intel" ? "border-blue-500" : "border-red-500"}
						px-2 pb-0.5 text-3xl font-light`}
					>
						{key}
					</h2>
					{Object.keys(list[key]).map((row, j) => {
						const currentRow = list[key][row];

						if (currentRow.type === "component") {
							return (
								<div key={row} className="grid grid-cols-2 pb-1 text-left">
									<span className="flex h-fit items-center gap-1">
										{currentRow.title}
										{currentRow.tooltip !== undefined && <Tooltip tip={currentRow.tooltip} />}
									</span>
									{currentRow.component({ cpu })}
								</div>
							);
						}

						//Get the value from the path
						const value = traversePath(currentRow.path, cpu);

						//If there is no value, and we want to hide the row, return an empty fragment the categories that are empty
						if ((value === null || value === undefined) && currentRow.hideOnUndefined === true) return <Fragment key={row} />;

						switch (currentRow.type) {
							case "number":
								return (
									<div key={row} className="grid grid-cols-2 pb-1 text-left">
										<span className="flex items-center gap-1">
											{currentRow.title}
											{currentRow.tooltip !== undefined && <Tooltip tip={currentRow.tooltip} />}
										</span>
										<span>
											{currentRow.prefix !== false ? formatNumber(value, currentRow.unit) : value + currentRow.unit}
										</span>
									</div>
								);
							case "string":
								return (
									<div key={row} className="grid grid-cols-2 text-left">
										<span className="flex items-center gap-1">
											{currentRow.title}
											{currentRow.tooltip !== undefined && <Tooltip tip={currentRow.tooltip} />}
										</span>
										<span>{currentRow.capitalize === true ? capitalize(value) : value}</span>
									</div>
								);

							case "date":
								return (
									<div key={row} className="grid grid-cols-2 text-left">
										<span>
											{currentRow.title}
											{currentRow.tooltip !== undefined && <Tooltip tip={currentRow.tooltip} />}
										</span>
										<span>{DateFormat.format(new Date(value))}</span>
									</div>
								);
						}
					})}
				</div>
			))}
	</Fragment>
);

const Cores = ({ cpu }: { cpu: CPU }) => {
	const cores = cpu.cores;

	if (cores.performance === null && cores.efficient === null) {
		return <span>{cores.total}</span>;
	} else if (cores.total === null) {
		return <span>Unknown</span>;
	}

	return (
		<>
			{cpu.cores.performance ?? 0}P / {cpu.cores.efficient ?? 0}E
		</>
	);
};
const Memory = ({ cpu }: { cpu: CPU }) => {
	if (cpu.memory.types === null) return <>N/A</>;

	return (
		<div>
			{cpu.memory.types.map((type) => (
				<Fragment key={type?.type}>
					<span>
						{type?.type} at {type?.speed} MHz
					</span>
					<br />
				</Fragment>
			))}
		</div>
	);
};

const TableStructure: Table = {
	General: {
		launchDate: {
			title: "Launch Date",
			path: "launchDate",
			type: "string",
		},
		market: {
			title: "Market",
			path: "marketSegment",
			type: "string",
			capitalize: true,
		},
		lithography: {
			title: "Lithography",
			path: "lithography",
			type: "string",
		},
		msrp: {
			title: "Price",
			path: "MSRP",
			type: "number",
			unit: "$",
			tooltip: "Manufacturer's suggested retail price.",
		},
	},
	"CPU specifications": {
		baseFrequency: {
			hideOnUndefined: true,
			title: "Base Frequency",
			path: "baseFrequency",
			type: "number",
			unit: "Hz",
		},
		maxFrequency: {
			title: "Max Frequency",
			path: "maxFrequency",
			type: "number",
			unit: "Hz",
		},
		cores: {
			title: "Cores",
			type: "component",
			component: Cores,
			tooltip: "Displays total amount of cores. For some Intel cpus, it also displays the amount of performance and efficient cores.",
		},
		tdp: {
			title: "TDP",
			path: "tdp",
			type: "number",
			unit: "W",
		},
	},
	"Memory specifications": {
		memory: {
			title: "Memory",
			type: "component",
			component: Memory,
		},
		capacity: {
			title: "Max Capacity",
			path: "memory.maxSize",
			type: "number",
			unit: "B",
		},
	},
	"GPU specifications": {
		baseClock: {
			title: "Base Clock",
			path: "graphics.baseFrequency",
			type: "number",
			unit: "Hz",
			hideOnUndefined: true,
		},
		maxClock: {
			title: "Max Clock",
			path: "graphics.maxFrequency",
			type: "number",
			unit: "Hz",
			hideOnUndefined: true,
		},
		display: {
			title: "Displays",
			path: "graphics.displays",
			type: "number",
			unit: "",
			hideOnUndefined: true,
		},
	},
	Other: {
		scrapedAt: {
			hideOnUndefined: true,
			title: "Scraped at",
			path: "scrapedAt",
			type: "date",
		},
		source: {
			title: "Source",
			type: "component",
			component: ({ cpu }: { cpu: CPU }) => (
				<a href={cpu.source} className="underline">
					Source
				</a>
			),
		},
	},
};

type Table = {
	[key: string]: Record<string, Row>;
};

type Row = { title: string; hideOnUndefined?: true; tooltip?: string } & ( // Prefix is whether is to add K, M, G, etc. to the number
	| { type: "number"; unit: string; prefix?: boolean; path: string }
	| { type: "component"; component: ({ cpu }: { cpu: CPU }) => JSX.Element }
	| { type: "string"; capitalize?: true; path: string }
	| { type: "date"; path: string }
);

const traversePath = (path: string, obj: any) => path.split(".").reduce((prev, curr) => prev && prev[curr], obj);

export const getServerSideProps: GetServerSideProps<{ data: CPU }> = async ({ params }) => {
	if (!params?.cpu) {
		return {
			notFound: true,
		};
	}

	let model = (params?.cpu as string).toLowerCase();
	const manufacturer = model.includes("intel") ? "intel" : model.includes("amd") ? "amd" : undefined;
	if (process.env.NODE_ENV === "development") console.log(model, manufacturer);

	if (!manufacturer) {
		return {
			notFound: true,
		};
	}

	let error: { code: number; message: string } | undefined;
	let result: CPU;

	if (manufacturer === "amd") {
		model = model.replace("™", "");
		result = await scrapeAMD(model, false).catch((err) => (error = err));
	} else {
		result = await scrapeIntel(model, false).catch((err) => (error = err));
	}

	if (error) return { notFound: true };

	return {
		props: { data: result },
	};
};

export default Cpu;
