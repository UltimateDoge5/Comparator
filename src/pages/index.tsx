import Head from "next/head";
import { useState } from "react";
import type { CPU } from "../../types";
import Comparison from "../components/comparison";

import Selector from "../components/selector";
import { Transition } from "@headlessui/react";

export default function Index() {
	const [cpus, setCpus] = useState<[CPU | null, CPU | null]>([null, null]);

	return (
		<>
			<Head>
				<title>Compare any CPU you want</title>
				<meta name="description" content="Comparator lets you compare CPUs and GPUs in an instant!" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>

			<main className="flex flex-col items-center gap-4 pt-12">
				<h1 className="text-6xl font-semibold text-white">Compare CPUs</h1>
				<h2 className="mb-4 text-2xl text-white">Search for a CPU and compare it to another one</h2>

				<section className="grid grid-cols-2 gap-8 p-2">
					<Selector setCPU={(cpu) => setCpus((prev) => [cpu, prev[1]])} urlId="f" />
					<Selector setCPU={(cpu) => setCpus((prev) => [prev[0], cpu])} urlId="s" />
				</section>
				<hr className="h-1 w-2/5 border-gray-500" />
				<section className="w-5/6 lg:w-1/2">
					<div className="mb-8 flex justify-center gap-6 text-white ">
						<div className="flex gap-2">
							<div className="h-6 w-12 bg-green-500 rounded" /> Better
						</div>
						<div className="flex gap-2">
							<div className="h-6 w-12 bg-red-500 rounded" /> Worse
						</div>
						<div className="flex gap-2">
							<div className="h-6 w-12 bg-yellow-500 rounded" /> Unable to compare
						</div>
					</div>
					<Transition
						appear={true}
						show={cpus[0] != null && cpus[1] != null}
						enter="transition-opacity duration-75"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity duration-150"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Comparison cpus={cpus as [CPU, CPU]} />
					</Transition>
				</section>
			</main>
		</>
	);
}