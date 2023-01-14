import type { CPU } from "../../types";
import { Fragment, useEffect } from "react";
import { domAnimation, LazyMotion, motion } from "framer-motion";

// Compare two CPUs
const Comparison = ({ cpus }: { cpus: [CPU, CPU] }) => {
	return (
		<LazyMotion features={domAnimation}>
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="relative overflow-x-auto shadow-md sm:rounded-t-md"
			>
				<table className="w-full table-fixed text-left text-2xl text-slate-500 dark:text-gray-300 [&_td,&_th]:px-4 [&_td,&_th]:py-2">
					<thead className="bg-gray-50 text-xl uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300">
						<tr className="border-b border-black">
							<th className="p-2 text-left">Feature</th>
							<th className="p-2 text-left underline"><a href={cpus[0].source}>{cpus[0].name}</a></th>
							<th className="p-2 text-left underline"><a href={cpus[1].source}>{cpus[1].name}</a></th>
						</tr>
					</thead>
					<tbody className="[&>tr]:border-b [&>tr]:bg-white/20">
						<tr>
							<td className="p-2">Cores</td>
							{cpus.map((cpu) => (
								<td className="p-2" key={cpu.name}>
									{cpu.cores.performance !== null && cpu.cores.efficient !== null ? (
										<>{cpu.cores.performance} / {cpu.cores.efficient}</>
									) : (cpu.cores.total)
									}
								</td>
							))}
						</tr>
						<tr>
							<td>Base clock</td>
							<td>{formatNumber(cpus[0].baseFrequency, "Hz")}</td>
							<td>{formatNumber(cpus[1].baseFrequency, "Hz")}</td>
						</tr>
						<tr>
							<td>Boost clock</td>
							<td>{formatNumber(cpus[0].maxFrequency, "Hz")}</td>
							<td>{formatNumber(cpus[1].maxFrequency, "Hz")}</td>
						</tr>
						<tr>
							<td>Cache</td>
							<td>{formatNumber(cpus[0].cache, "B")}</td>
							<td>{formatNumber(cpus[1].cache, "B")}</td>
						</tr>
						<tr>
							<td>TDP</td>
							<td>{cpus[0].tdp || "N/A"} W</td>
							<td>{cpus[1].tdp || "N/A"} W</td>
						</tr>
						<tr>
							<td>Lithography</td>
							<td>{cpus[0].lithography || "Unknown"} </td>
							<td>{cpus[1].lithography || "Unknown"} </td>
						</tr>
						<tr>
							<td>Release date</td>
							<td>{cpus[0].launchDate}</td>
							<td>{cpus[1].launchDate}</td>
						</tr>
						<>
						<tr>
							<td
								colSpan={3}
								className="bg-gray-50 text-center text-xl uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300"
							>
								Memory
							</td>
						</tr>
							<tr>
								<td>Memory type</td>
								{cpus.map((cpu) => (
									<td key={cpu.name}>
										{cpu.memory.types.map((type) => (
											<Fragment key={type?.type}>
												<span>{type?.type} at {type?.speed} MHz</span>
												<br />
											</Fragment>
										))}
									</td>
								))}
							</tr>
							<tr>
								<td>Max size</td>
								{cpus.map((cpu) => (
									<td key={cpu.name}>
										{formatNumber(cpu.memory.maxSize, "B")}
									</td>
								))}
							</tr>
						</>
							<tr>
								<td
									colSpan={3}
									className="bg-gray-50 text-center text-xl uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300"
								>
									Graphics
								</td>
							</tr>
							<GraphicsComparison cpus={cpus} />
						</tbody>
				</table>
			</motion.div>
		</LazyMotion>
	);
};

const GraphicsComparison = ({ cpus }: { cpus: CPU[] }) => {
	if (cpus.filter((cpu) => cpu.graphics).length === 0) {
		return (
			<tr>
				<td colSpan={3}>No graphics</td>
			</tr>
		);
	}

	return (
		<>
			<tr>
				<td>Base clock</td>
				{cpus.map((cpu) => cpu.graphics !== false ? (<td key={cpu.name}>{formatNumber(cpu.graphics.baseFrequency, "Hz")}</td>) : (
					<td key={cpu.name} rowSpan={3}>No graphics included</td>))}
			</tr>
			<tr>
				<td>Boost clock</td>
				{cpus.map((cpu) => cpu.graphics !== false && (
					<td key={cpu.name}>{formatNumber(cpu.graphics.maxFrequency, "Hz")}</td>
				))}
			</tr>
			<tr>
				<td>Max displays</td>
				{cpus.map((cpu) => cpu.graphics !== false && (
					<td key={cpu.name}>{cpu.graphics.displays || "Unknown"}</td>
				))}
			</tr>
		</>
	);
};

const formatNumber = (num: number | null, unit: string) => {
	if (num === null) return "N/A " + unit;

	const prefixes = ["", "K", "M", "G", "T"];
	const prefix = prefixes[Math.floor(Math.log10(num) / 3)];
	const value = num / Math.pow(10, prefixes.indexOf(prefix) * 3);

	return `${value % 1 !== 0 ? value.toFixed(2) : value} ${prefix}${unit}`;
};

export default Comparison;
