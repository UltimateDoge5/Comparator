import Head from "next/head";
import { useEffect, useState } from "react";
import type { CPU, Manufacturer } from "../../types";
import Comparison from "../components/comparison";
import fetchCPU from "../util/fetchCPU";

export default function Index() {
	const [cpus, setCpus] = useState<[CPU | null, CPU | null]>([null, null]);
	const [selection, setSelection] = useState<Selection[]>([
		{ manufacturer: "intel", model: "" },
		{ manufacturer: "intel", model: "" }
	]);

	// Load the cpus from url
	useEffect(() => {
		const url = new URL(window.location.href);
		const cpu1 = url.searchParams.get("f");
		const cpu2 = url.searchParams.get("s");

		if (cpu1 && cpu2) {
			setSelection([
				{ manufacturer: cpu1.split("-")[0], model: decodeURIComponent(cpu1.split("-")[1]) },
				{ manufacturer: cpu2.split("-")[0], model: decodeURIComponent(cpu2.split("-")[1]) }
			]);

			// Load cpus
			const cpusFetch = [
				fetchCPU(cpu1.split("-")[0] as Manufacturer, decodeURIComponent(cpu1.split("-")[1])),
				fetchCPU(cpu2.split("-")[0] as Manufacturer, decodeURIComponent(cpu2.split("-")[1]))
			];

			Promise.all(cpusFetch).then((cpus) => setCpus(cpus as [CPU, CPU]));
		}
	}, []);

	useEffect(() => {
		const url = new URL(window.location.href);

		if (selection[0].model.length > 3) {
			url.searchParams.set("f", `${selection[0].manufacturer}-${encodeURIComponent(selection[0].model)}`);
		} else {
			url.searchParams.delete("f");
		}

		if (selection[1].model.length > 3) {
			url.searchParams.set("s", `${selection[1].manufacturer}-${encodeURIComponent(selection[1].model)}`);
		} else {
			url.searchParams.delete("s");
		}

		window.history.replaceState({}, "", url.toString());
	}, [selection]);

	return (
		<>
			<Head>
				<title>Compare any CPU you want</title>
				<meta name="description" content="Comparator lets you compare CPUs and GPUs in an instant!" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<div className="absolute -top-8 -left-20 -z-10 h-full w-full bg-gradient-to-br from-sky-700 via-transparent" />
			<div className="absolute top-10 right-0 -z-10 h-full w-full bg-gradient-to-tl from-violet-700 via-transparent" />
			<main className="flex flex-col items-center gap-4 pt-12">
				<h1 className="text-6xl font-semibold text-white">Compare CPUs</h1>
				<h2 className="mb-4 text-2xl text-white">Search for a CPU and compare it to another one</h2>

				<section className="grid grid-cols-2 gap-8 p-2">
					<div className="flex flex-col items-center gap-4 rounded-md border bg-white bg-opacity-10 p-4">
						<div className="flex items-center gap-4">
							<select
								className="rounded-md bg-gray-200 p-2"
								onChange={(e) =>
									setSelection((prev) => [
										{ manufacturer: e.target.value, model: prev[0].model },
										prev[1]
									])
								}
							>
								<option value="intel">Intel</option>
								<option value="amd">AMD</option>
							</select>
							<input
								className="rounded-md bg-gray-200 p-2"
								placeholder={selection[0].manufacturer === "intel" ? "i5-5400" : "Ryzen 7 5800H"}
								onChange={(e) =>
									setSelection((prev) => [
										{ manufacturer: prev[0].manufacturer, model: e.target.value },
										prev[1]
									])
								}
								value={selection[0].model}
							/>
						</div>
						<button
							className="pointer w-4/5 rounded-md bg-sky-500 px-6 py-2 transition-all enabled:hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-75"
							disabled={selection[0].model.length < 3}
							onClick={async () => {
								if (selection[0].model.length < 3) return;

								const res = await fetch(
									`/api/cpu/${selection[0].manufacturer.toLocaleLowerCase()}?model=${
										selection[0].model
									}`
								);

								if (!res.ok) {
									console.error(await res.text());
									return;
								}

								const cpu = (await res.json()) as CPU;
								setCpus((prev) => [cpu, prev[1]]);
							}}
						>
							Search
						</button>
					</div>

					<div className="flex flex-col items-center gap-4 rounded-md border bg-white bg-opacity-10 p-4">
						<div className="flex items-center gap-4">
							<select
								className="rounded-md bg-gray-200 p-2"
								onChange={(e) =>
									setSelection((prev) => [
										prev[0],
										{ manufacturer: e.target.value, model: prev[1].model }
									])
								}
							>
								<option value="intel">Intel</option>
								<option value="amd">AMD</option>
							</select>
							<input
								className="rounded-md bg-gray-200 p-2"
								placeholder={selection[1].manufacturer === "intel" ? "i7-9700K" : "Ryzen 7 3700X"}
								onChange={(e) =>
									setSelection((prev) => [
										prev[0],
										{ manufacturer: prev[1].manufacturer, model: e.target.value }
									])
								}
								value={selection[1].model}
							/>
						</div>
						<button
							className="pointer w-4/5 rounded-md bg-sky-500 px-6 py-2 transition-all enabled:hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-75"
							disabled={selection[1].model.length < 3}
							onClick={async () => {
								if (selection[1].model.length < 3) return;

								const res = await fetch(
									`/api/cpu/${selection[1].manufacturer.toLocaleLowerCase()}?model=${
										selection[1].model
									}`
								);

								if (!res.ok) {
									console.error(await res.text());
									return;
								}

								const cpu = (await res.json()) as CPU;
								setCpus((prev) => [prev[0], cpu]);
							}}
						>
							Search
						</button>
					</div>
				</section>
				<hr className="h-1 w-2/5 border-gray-500" />
				<section className="w-1/2">
					<div className="mb-8 flex justify-center gap-6 text-white">
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
					{cpus[0] != null && cpus[1] != null && <Comparison cpus={cpus as [CPU, CPU]} />}
				</section>
			</main>
		</>
	);
}

interface Selection {
	manufacturer: string;
	model: string;
}
