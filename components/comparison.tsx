import type { CPU } from "../types";

// Compare two CPUs
const Comparison = ({ cpus }: { cpus: [CPU, CPU] }) => {
	return (
		<div className="relative overflow-x-auto shadow-md sm:rounded-t-md">
			<table className="w-full text-left text-2xl text-slate-500 dark:text-gray-300 [&_td,&_th]:px-4 [&_td,&_th]:py-2">
				<thead className="bg-gray-50 text-xl uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300">
					<tr className="border-b border-black">
						<th className="p-2 text-left">Feature</th>
						<th className="p-2 text-left">{`${cpus[0].manufacturer} ${cpus[0].name}`}</th>
						<th className="p-2 text-left">{`${cpus[1].manufacturer} ${cpus[1].name}`}</th>
					</tr>
				</thead>
				<tbody className="[&>tr]:border-b [&>tr]:bg-white/20">
					<tr>
						<td>Core count</td>
						<td>{cpus[0].cores.total}</td>
						<td>{cpus[1].cores.total}</td>
					</tr>
					<tr>
						<td>Base clock</td>
						<td>{formatNumber(cpus[0].baseFrequency)} GHz</td>
						<td>{formatNumber(cpus[1].baseFrequency)} GHz</td>
					</tr>
					<tr>
						<td>Boost clock</td>
						<td>{formatNumber(cpus[0].maxFrequency)}Hz</td>
						<td>{formatNumber(cpus[1].maxFrequency)}Hz</td>
					</tr>
					<tr>
						<td>Cache</td>
						<td>{cpus[0].cache} MB</td>
						<td>{cpus[1].cache} MB</td>
					</tr>
					<tr>
						<td>TDP</td>
						<td>{cpus[0].tdp} W</td>
						<td>{cpus[1].tdp} W</td>
					</tr>
					<tr>
						<td>Lithography</td>
						<td>{cpus[0].lithography} </td>
						<td>{cpus[1].lithography} </td>
					</tr>
					<tr>
						<td>Release date</td>
						<td>{cpus[0].launchDate}</td>
						<td>{cpus[1].launchDate}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

const formatNumber = (num: number | null) => {
	if (num === null) return "N/A";

	const prefixes = ["", "K", "M", "G", "T"];
	const prefix = prefixes[Math.floor(Math.log10(num) / 3)];
	const value = num / Math.pow(10, prefixes.indexOf(prefix) * 3);
	return `${value.toFixed(2)} ${prefix}`;
};

export default Comparison;
