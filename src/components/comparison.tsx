import type { CPU } from "../../types";

// Compare two CPUs
const Comparison = ({ cpus }: { cpus: [CPU, CPU] }) => {
	return (
		<div className="relative overflow-x-auto shadow-md sm:rounded-t-md">
			<table className="w-full text-left text-2xl text-slate-500 dark:text-gray-300 [&_td,&_th]:px-4 [&_td,&_th]:py-2">
				<thead className="bg-gray-50 text-xl uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300">
					<tr className="border-b border-black">
						<th className="p-2 text-left">Feature</th>
						<th className="p-2 text-left">{`${cpus[0].manufacturer === "amd" ? "" : "Intel"} ${cpus[0].name}`}</th>
						<th className="p-2 text-left">{`${cpus[1].manufacturer === "amd" ? "" : "Intel"} ${cpus[1].name}`}</th>
					</tr>
				</thead>
				<tbody className="[&>tr]:border-b [&>tr]:bg-white/20">
					<tr>
						<td>Core count</td>
						<td>{cpus[0].cores.total || "N/A"}</td>
						<td>{cpus[1].cores.total || "N/A"}</td>
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
									{cpu.memory.type}
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
		</div>
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
				{cpus.map((cpu) => cpu.graphics !== false ? (
					<td key={cpu.name}>{formatNumber(cpu.graphics.baseFrequency, "Hz")}</td>
				) : (
					                   <td key={cpu.name} rowSpan={3}>No graphics included</td>
				                   ))}
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
					<td key={cpu.name}>{cpu.graphics.displays}</td>
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
	return `${value.toFixed(2)} ${prefix}${unit}`;
};

export default Comparison;
