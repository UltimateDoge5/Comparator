import type { CPU } from "../../types";
import { Fragment } from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";

// Compare two CPUs
const Comparison = ({ cpus }: { cpus: [CPU, CPU] }) => {
	return (
		<LazyMotion features={domAnimation}>
			<m.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="relative overflow-x-auto shadow-md sm:rounded-t-md"
			>
				<table className="w-full table-fixed text-left text-2xl text-slate-500 dark:text-gray-300 [&_td,&_th]:px-4 [&_td,&_th]:py-2">
					<thead className="bg-gray-50 text-xl uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300">
						<tr className="border-b border-black">
							<th className="p-2 text-left">Feature</th>
							<th className="p-2 text-left underline">
								<a href={cpus[0].source}>{cpus[0].name}</a>
							</th>
							<th className="p-2 text-left underline">
								<a href={cpus[1].source}>{cpus[1].name}</a>
							</th>
						</tr>
					</thead>
					<tbody className="[&>tr]:border-b [&>tr]:bg-white/20">
						{RenderComparison(cpus, FeatureNames)}
					</tbody>
				</table>
			</m.div>
		</LazyMotion>
	);
};

const RenderComparison = (cpus: [CPU, CPU], list: FeatureList, ...keys: string[]): JSX.Element[] =>
	(Object.keys(list) as (keyof CPU) []).map((key) => {
		const feature = list[key as keyof typeof list] as Feature;
		if (feature?.type === undefined) return RenderComparison(cpus, feature, key) as unknown as JSX.Element;

		// Get the values for the nested features
		const [cpu1, cpu2] = cpus.map(cpu => traverse(cpu, ...keys));

		switch (feature.type) {
			case "custom":
				return feature.parse(cpus);
			case "string":
				return (
					<tr key={feature.title}>
						<td>{feature.title}</td>
						<td>{cpu1[key] as string}</td>
						<td>{cpu2[key] as string}</td>
					</tr>
				);
			case "number": {
				const [a, b] = [cpu1[key] as number, cpu2[key] as number];
				const indexToColor = a > b ? 0 : b > a ? 1 : -1;
				return (
					<tr key={feature.title}>
						<td>{feature.title}</td>
						<td>
							<span
								className={indexToColor === -1 ? "text-gray-300" : indexToColor === 0 ? "text-green-500" : "text-red-400"}
							>
								{formatNumber(a, feature.unit || "")}
							</span>
						</td>
						<td>
							<span
								className={indexToColor === -1 ? "text-gray-300" : indexToColor === 1 ? "text-green-500" : "text-red-400"}
							>
								{formatNumber(b, feature.unit || "")}
							</span>
						</td>
					</tr>
				);
			}
		}
	});

const FeatureNames: FeatureList = {
	cores: {
		title: "Cores",
		type: "custom",
		parse: (cpus) => (
			<tr key="cores">
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
		)
	},
	baseFrequency: {
		title: "Base Frequency",
		type: "number",
		unit: "Hz"
	},
	maxFrequency: {
		title: "Max Frequency",
		type: "number",
		unit: "Hz"
	},
	cache: {
		title: "Cache",
		type: "number",
		unit: "B"
	},
	tdp: {
		title: "TDP",
		type: "number",
		unit: "W"
	},
	lithography: {
		title: "Lithography",
		type: "string"
	},
	launchDate: {
		title: "Launch Date",
		type: "string"
	},
	memory: {
		types: {
			title: "types",
			type: "custom",
			parse: (cpus) => (
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
						<td className="p-2">Memory Types</td>
						{/*{cpus.map((cpu) => (*/}
						{/*	<td className="p-2" key={cpu.name}>*/}
						{/*		{cpu.memory.types.map((type) => (*/}
						{/*			<Fragment key={type?.type}>*/}
						{/*				<span>{type?.type} at {type?.speed} MHz</span>*/}
						{/*				<br />*/}
						{/*			</Fragment>*/}
						{/*		))}*/}
						{/*	</td>*/}
						{/*))}*/}
						<MemoryComparison cpus={cpus} />
					</tr>
				</>
			)
		},
		maxSize: {
			title: "Max Size",
			type: "number",
			unit: "B"
		}
	},
	graphics: {
		title: "Graphics",
		type: "custom",
		parse: (cpus) => (
			<>
				<tr>
					<td
						colSpan={3}
						className="bg-gray-50 text-center text-xl uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300"
					>
						Graphics
					</td>
				</tr>
				{GraphicsComparison({ cpus })}
			</>)
	}
};

type FeatureList = {
	[key in keyof CPU]?: Feature | Record<string, Feature>;
};

type Feature = { title: string } & (
	| { type: "number"; unit?: string }
	| { type: "string" }
	| { type: "custom"; card?: true; parse: (cpus: CPU[]) => JSX.Element });


const MemoryComparison = ({ cpus }: { cpus: CPU[] }) => {
	// compare memory speeds for matching types
	const matchingTypes = cpus[0].memory.types.filter((type) => cpus[1].memory.types.some((type2) => type2?.type === type?.type))
		.map((type) => type?.type);
	const memorySpeeds = matchingTypes.map((type) => {
		const a = cpus[0].memory.types.find((type2) => type2?.type === type)?.speed as number;
		const b = cpus[1].memory.types.find((type2) => type2?.type === type)?.speed as number;
		return { type, a, b, indexToColor: a > b ? 0 : b > a ? 1 : -1 };
	});

	return (
		<>
			{cpus.map((cpu,i) => (
				<td className="p-2" key={cpu.name}>
					{memorySpeeds.map(({ type, a, b, indexToColor }) => (
						<Fragment key={type}>
							<span className={indexToColor === i ? "text-green-500" : "text-red-400"}>
								{type} at {cpu.name === cpus[0].name ? a : b} MHz
							</span>
							 <br />
						</Fragment>
					))}
					{cpu.memory.types.filter((type) => !matchingTypes.includes(type?.type)).map((type) => (
						<Fragment key={type?.type}>
							<span>{type?.type} at {type?.speed} MHz</span>
							<br />
						</Fragment>
					))}
				</td>
			))}
		</>
	);
};

const GraphicsComparison = ({ cpus }: { cpus: CPU[] }) => {
	if (cpus.filter((cpu) => cpu.graphics).length === 0) {
		return (
			<tr key="no-graphics">
			<td colSpan={3}>No graphics</td>
			</tr>
		);
	}

	return (
		<>
			<tr>
			<td>Base clock</td>
				{cpus.map((cpu) =>
						cpu.graphics !== false ? (
							<td key={cpu.name}>{formatNumber(cpu.graphics.baseFrequency, "Hz")}</td>
						) : (
							<td key={cpu.name} rowSpan={3}>
			No graphics included
			</td>
						)
				)}
			</tr>
			<tr>
			<td>Boost clock</td>
				{cpus.map(
					(cpu) =>
						cpu.graphics !== false && (
							<td key={cpu.name}>{formatNumber(cpu.graphics.maxFrequency, "Hz")}</td>
						)
				)}
			</tr>
			<tr>
			<td>Max displays</td>
				{cpus.map(
					(cpu) => cpu.graphics !== false && <td key={cpu.name}>{cpu.graphics.displays || "Unknown"}</td>
				)}
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

const traverse = (obj: Record<string
	, any>, ...keys: string[]) => {
	let current = obj;
	for (const key of keys) {
		current = current[key];
	}
	return current;
};

export default Comparison;
