import Head from "next/head";
import { useState } from "react";
import type { CPU } from "../../CPU";
import Comparison from "../components/comparison";

import Selector from "../components/selector";

export default function Index() {
	const [cpus, setCpus] = useState<[CPU | null, CPU | null]>([null, null]);
	const cpusFulfilled = cpus.every((cpu) => cpu !== null);

	return (
		<>
			<Head>
				<title>Compare any CPU you want</title>
				<meta name="description" content="Comparator lets you compare CPUs and GPUs in an instant!" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />

				<link rel="canonical" href="https://comparator.pkozak.org" />
			</Head>

			{/*<h1 className="uppercase absolute top-2 left-2 text-2xl text-white font-bold italic">Comparator</h1>*/}
			<main
				className={`flex ${
					cpusFulfilled ? "min-h-[130vh]" : "min-h-[90vh]"
				} flex-col items-center gap-4 pt-12 transition-all`}
			>
				<h1 className="text-center text-6xl font-semibold text-white">Compare CPUs</h1>
				<h2 className="mb-4 px-2 text-center text-2xl text-white">
					Search for a CPU and compare it to another one
				</h2>

				<section className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2 md:gap-8">
					<Selector setCPU={(cpu) => setCpus((prev) => [cpu, prev[1]])} urlId="f" />
					<span className="block text-center text-xl font-semibold text-white md:hidden">VS</span>
					<Selector setCPU={(cpu) => setCpus((prev) => [prev[0], cpu])} urlId="s" />
				</section>
				<hr className="h-1 w-2/5 border-gray-500" />
				<section className="mb-12 w-full p-4 md:w-5/6 lg:w-1/2">
					<div className="mb-8 hidden justify-center gap-6 text-white md:flex">
						<div className="flex gap-2">
							<div className="h-6 w-12 rounded bg-green-500" /> Better
						</div>
						<div className="flex gap-2">
							<div className="h-6 w-12 rounded bg-red-500" /> Worse
						</div>
						<div className="flex gap-2">
							<div className="h-6 w-12 rounded bg-yellow-500" /> Unable to compare
						</div>
					</div>

					{cpusFulfilled ? (
						<Comparison cpus={cpus as [CPU, CPU]} />
					) : (
						<h3 className="text-center text-xl text-white ">Select two CPUs to compare them</h3>
					)}
				</section>
			</main>
			<footer className="flex min-h-[10vh] w-full flex-col items-center gap-x-4 gap-y-2 border-t bg-slate-700/25 py-4 text-center md:flex-row md:justify-center">
				<p className="text-white">
					Made by
					{/* eslint-disable-next-line react/jsx-no-target-blank */}
					<a className="text-blue-500" href="https://pkozak.org" target="_blank">
						{" "}
						Piotr Kozak
					</a>
				</p>

				<p className="text-white">
					Source code available on
					<a
						className="text-blue-500"
						href="https://github.com/UltimateDoge5/Comparator"
						target="_blank"
						rel="noreferrer"
					>
						{" "}
						GitHub{" "}
					</a>
				</p>
				<iframe
					src="https://ghbtns.com/github-btn.html?user=UltimateDoge5&repo=comparator&type=star&count=true"
					width="150"
					height="20"
					title="GitHub"
				/>
			</footer>
		</>
	);
}
