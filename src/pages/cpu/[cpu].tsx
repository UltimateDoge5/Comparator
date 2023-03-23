import type { CPU } from "../../../CPU";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Footer from "../../components/footer";
import { splitFirst } from "../../components/selector";
import Head from "next/head";
import { formatNumber } from "../../util/formatting";
import Navbar from "../../components/navbar";
import { domAnimation, LazyMotion, m, useTime, useTransform } from "framer-motion";
import { ReloadIcon } from "../../components/icons";
import { useState } from "react";
import fetchCPU from "../../util/fetchCPU";
import { toast } from "react-toastify";

export const config = {
	runtime: "experimental-edge",
};

const Cpu = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const title = `${data.name} | PrimeCPU`;

	const time = useTime();
	const rotate = useTransform(time, [0, 2000], [0, 360], { clamp: false });
	const [refetch, setRefetch] = useState(false);

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
			<div className="min-h-[90vh] text-white">
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
							window.location.reload();
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
				<table className="w-3/5 table-auto bg-white/20 [&td]:w-1/2">
					<tbody className="text-xl [&span]:leading-6">
						<tr>
							<td className="text-left">Manufacturer</td>
							<td>{data.manufacturer}</td>
						</tr>
						<tr>
							<td className="text-left">Model</td>
							<td>{data.name}</td>
						</tr>
						<tr>
							<td className="text-left">Cores</td>
							<td>
								<Cores cores={data.cores} />
							</td>
						</tr>
						<tr>
							<td className="text-left">Threads</td>
							<td>{data.threads}</td>
						</tr>
						<tr>
							<td className="text-left">Base Clock</td>
							<td>{formatNumber(data.baseFrequency, "Hz")}</td>
						</tr>
						<tr>
							<td className="text-left">Boost Clock</td>
							<td>{formatNumber(data.maxFrequency, "Hz")}</td>
						</tr>
						<tr>
							<td className="text-left">TDP</td>
							<td>{data.tdp} W</td>
						</tr>
						<tr>
							<td className="text-left">Price</td>
							<td>{data.MSRP}</td>
						</tr>
						<tr>
							<td className="text-left">Platform</td>
							<td>{data.marketSegment}</td>
						</tr>
						<tr>
							<td className="text-center" colSpan={2}>
								<a href={data.source}>Source</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<Footer />
		</>
	);
};

const Cores = ({ cores }: { cores: CPU["cores"] }) => {
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

export const getServerSideProps: GetServerSideProps<{ data: CPU }> = async ({ req }) => {
	// res.setHeader(
	// 	"Cache-Control",
	// 	"public, s-maxage=3600, stale-while-revalidate=86400",
	// );

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
