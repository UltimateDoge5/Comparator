"use client";
import { useState } from "react";
import type { CPU } from "../../CPU";
import type { Selection } from "./selector";
import Selector from "./selector";
import { Transition } from "@headlessui/react";
import Table from "./table";
import { ToastContainer } from "react-toastify";

const Comparison = ({ f, s }: { f: Selection; s: Selection }) => {
	const [cpus, setCpus] = useState<[CPU | null, CPU | null]>([null, null]);
	const cpusFulfilled = cpus.every((cpu) => cpu !== null);

	return (
		<main className="flex flex-col items-center gap-4 pt-4 transition-all md:pt-12 ">
			<h1 className="text-center text-4xl font-semibold text-white md:text-6xl">Compare CPUs</h1>
			<h2 className="mb-4 px-2 text-center text-xl text-white md:text-2xl">Search for a CPU and compare it to another one</h2>

			<section className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2 md:gap-8">
				<Selector setCPU={(cpu) => setCpus((prev) => [cpu, prev[1]])} urlId="f" initialSelection={f} />
				<span className="block text-center text-xl font-semibold text-white md:hidden">VS</span>
				<Selector setCPU={(cpu) => setCpus((prev) => [prev[0], cpu])} urlId="s" initialSelection={s} />
			</section>
			<hr className="h-1 w-2/5 border-gray-500" />
			<section className="mb-12 flex w-full flex-col items-center p-4 pt-0 md:w-5/6 lg:w-3/5">
				<Transition
					show={cpusFulfilled}
					enter="transition-opacity duration-500"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity duration-500"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<h3 className="hidden pb-2 text-center text-2xl text-white sm:block">Table colors</h3>
					<div className="mb-8 hidden w-fit justify-center gap-6 rounded-lg p-2 text-white sm:flex">
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
				</Transition>

				{cpusFulfilled ? (
					<Table cpus={cpus as [CPU, CPU]} />
				) : (
					<h3 className="flex items-center gap-2 text-center text-2xl text-white ">Select two CPUs to compare them</h3>
				)}
			</section>
			<ToastContainer autoClose={2500} position="bottom-left" theme="dark" draggable={false} />
		</main>
	);
};

export default Comparison;
