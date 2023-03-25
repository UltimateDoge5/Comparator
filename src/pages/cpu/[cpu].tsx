import type { CPU } from "../../../CPU";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Footer from "../../components/footer";
import { splitFirst } from "../../components/selector";
import Head from "next/head";
import { formatNumber } from "../../util/formatting";
import Navbar from "../../components/navbar";
import { domAnimation, LazyMotion, m, useTime, useTransform } from "framer-motion";
import { ReloadIcon } from "../../components/icons";
import { Fragment, useEffect, useState } from "react";
import fetchCPU from "../../util/fetchCPU";
import { toast, ToastContainer } from "react-toastify";

export const config = {
	runtime: "experimental-edge",
};

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
			window.history.replaceState({}, "", window.location.pathname + "?" + searchParams.toString());
		}
	}, []);

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta
					name="description"
					content={`Here you'll find all the information you need about the ${data.name} processor.`}
				/>
			</Head>
			<Navbar />
			<div className="min-h-[90vh] bg-gray-800 text-white">
				<h1 className="text-3xl">{data.name}</h1>
				<button
					onClick={() => {
						setRefetch(true);
						fetchCPU(data.manufacturer, data.name || "", true).then((cpu) => {
							setRefetch(false);
							if (cpu.error) {
								toast.error(
									cpu.error.code === 504
									? "The server is taking too long to respond. Try again later."
									: cpu.error.text,
								);
								return;
							}
							window.location.replace(window.location.href + "?r=true");
						});
					}}
					title="Reload data"
					disabled={data.name === null || refetch}
					className="rounded-md border border-gray-400/20 bg-gray-400/20 p-2 transition-all
					enabled:cursor-pointer enabled:hover:bg-gray-200/50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<LazyMotion features={domAnimation}>
						<m.div style={{ rotate: refetch ? rotate : 0 }}>
							<ReloadIcon className="h-5 w-5 text-white/60" />
						</m.div>
					</LazyMotion>
				</button>
				<div className="w-3/5 bg-white/20 p-6">
					<RenderTable cpu={data} list={TableStructure} />
				</div>
			</div>
			<ToastContainer autoClose={2500} position="bottom-left" theme="dark" draggable={false} />
			<Footer />
		</>
	);
};

const RenderTable = ({ cpu, list }: { cpu: CPU; list: Table }) => (
	<Fragment>
		{Object.keys(list).map((key) => (
			<div key={key}>
				{Object.keys(list[key]).map((row) => {
					const currentRow = list[key][row];
					if (currentRow.type === "component") return currentRow.component({ cpu });

					const value = traversePath(currentRow.path, cpu);

					switch (currentRow.type) {
						case "number":
							return (
								<div key={row}>
									<span className="text-left">{currentRow.title}</span>
									<span className="text-right">
										{currentRow.prefix
										 ? formatNumber(value, currentRow.unit)
										 : value + currentRow.unit}
									</span>
								</div>
							);
						case "string":
							return (
								<div key={row}>
									<span className="text-left">{currentRow.title}</span>
									<span className="text-right">{value}</span>
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
	}

	return (
		<>
			<span>Performance: {cores.performance}</span>
			<br />
			<span>Efficient: {cores.efficient}</span>
		</>
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
			path: "market",
			type: "string",
		},
		lithography: {
			title: "Lithography",
			path: "lithography",
			type: "string",
		},
	},
	Performance: {
		cores: {
			title: "Cores",
			type: "component",
			component: Cores,
		},
	},
};

type Table = {
	[key: string]: Record<string, Row>;
};

type Row = { title: string } & ( // Prefix is whether is to add K, M, G, etc. to the number
	| { type: "number"; unit: string; prefix?: boolean; path: string }
	| { type: "component"; component: ({ cpu }: { cpu: CPU }) => JSX.Element }
	| { type: "string"; path: string }
	);

const traversePath = (path: string, obj: any) => path.split(".").reduce((prev, curr) => prev && prev[curr], obj);

export const getServerSideProps: GetServerSideProps<{ data: CPU }> = async ({ req }) => {
	if (!req.url) {
		return {
			notFound: true,
		};
	}

	let model = decodeURI(req.url.replaceAll("-", " ")?.split("/")[2].toLowerCase());
	const manufacturer = splitFirst(decodeURI(model), " ")[0];
	if (process.env.NODE_ENV === "development") console.log(model, manufacturer);

	if (!manufacturer || !model || !["intel", "amd"].includes(manufacturer)) {
		return {
			notFound: true,
		};
	}

	if (manufacturer === "amd") {
		model = model.replace("™", "");
	}

	const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
	const response = await fetch(`${protocol}://${req.headers.host}/api/cpu/${manufacturer}/?model=${model}`);

	if (!response.ok) {
		return {
			notFound: true,
		};
	}

	const data = (await response.json()) as CPU;

	return {
		props: { data: data },
	};
};

export default Cpu;
