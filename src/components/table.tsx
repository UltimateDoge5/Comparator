"use client"
import type { CPU, Graphics } from "../../CPU";
import { Fragment, useEffect } from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";
import { capitalize, colorDiff, formatNumber } from "../util/formatting";
import { toast } from "react-toastify";
import Link from "next/link";

// Compare two CPUs
const Table = ({ cpus }: { cpus: [CPU, CPU] }) => {
	useEffect(() => {
		(async () => {
			let i = 0;
			for (const cpu of cpus) {
				if (cpu.marketSegment === "desktop" && cpu.MSRP === null && cpu.manufacturer === "amd") {
					const $toast = toast.loading("Loading price for " + cpu.name + "...");
					const res = await fetch(`/api/cpu/getPrice?model=${cpu.name}`);

					if (res.ok) {
						const price = await res.json();
						(document.querySelector("#price-" + i) as HTMLSpanElement).innerHTML = price + "$";
						toast.update($toast, {
							render: "Price for " + cpu.name + " loaded",
							type: "success",
							autoClose: 2500,
							isLoading: false,
						});
					} else {
						toast.update($toast, {
							render: "Failed to load price for " + cpu.name,
							type: "error",
							autoClose: 2500,
							isLoading: false,
						});
					}
				}
				i++;
			}
		})();
	}, [cpus]);

	return (
		<LazyMotion features={domAnimation}>
			<m.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="relative overflow-x-auto shadow-md sm:rounded-t-md"
			>
				<table className="w-full table-fixed text-left text-xl text-gray-300 md:text-2xl [&_td]:px-4 [&_td]:py-2">
					<thead className="bg-gray-700 text-base uppercase text-gray-300 md:text-xl">
						<tr className="border-b border-black">
							<th className="p-2 text-left">Feature</th>
							{cpus.map((cpu) => (
								<th className="p-2 text-left underline transition-colors hover:text-white" key={cpu.name}>
									<Link href={cpu?.ref ?? `/cpu/${cpu.name?.replace(/ /g, "-")}`} target="_blank" rel="noreferrer">
										{cpu.name}
									</Link>
								</th>
							))}
						</tr>
					</thead>
					<tbody className="[&>tr]:border-b [&>tr]:bg-white/20">{RenderComparison(cpus, FeatureNames)}</tbody>
				</table>
			</m.div>
		</LazyMotion>
	);
};

const RenderComparison: (cpus: [CPU, CPU], list: FeatureList, ...keys: string[]) => JSX.Element = (
	cpus: [CPU, CPU],
	list: FeatureList,
	...keys: string[]
) => (
	<Fragment key={keys.join("-")}>
		{Object.keys(list).map((key) => {
			const feature = list[key as keyof typeof list] as Feature;
			if (feature?.type === undefined) return RenderComparison(cpus, feature, key);

			const [cpu1, cpu2] = cpus.map((cpu) => traverse(cpu, ...keys));

			switch (feature.type) {
				case "custom":
					return feature.parse(cpus);
				case "string":
					return (
						<tr key={key}>
							<td>{feature.title}</td>
							<td className="text-center md:text-left">{cpu1[key] as string}</td>
							<td className="text-center md:text-left">{cpu2[key] as string}</td>
						</tr>
					);
				case "number": {
					const [a, b] = [cpu1[key] as number, cpu2[key] as number];

					return (
						<tr key={key}>
							<td>{feature.title}</td>
							<td className="text-center md:text-left">
								<span className={colorDiff(a, b, feature.reverse === true)}>
									{feature.prefix === false ? (a ?? "N/A") + (feature?.unit || "") : formatNumber(a, feature.unit || "")}
								</span>
							</td>
							<td className="text-center md:text-left">
								<span className={colorDiff(a, b, feature.reverse !== true)}>
									{feature.prefix === false ? (b ?? "N/A") + (feature?.unit || "") : formatNumber(b, feature.unit || "")}
								</span>
							</td>
						</tr>
					);
				}
			}
		})}
	</Fragment>
);

const FeatureNames: FeatureList = {
	cores: {
		title: "Cores",
		type: "custom",
		parse: (cpus) => (
			<tr key="cores">
				<td className="p-2">Cores</td>
				{cpus.map((cpu, i) => (
					<td className="p-2 text-center md:text-left" key={cpu.name}>
						<span className={colorDiff(cpu.cores.total, cpus[1 - i].cores.total)}>
							{cpu.cores.performance !== null && cpu.cores.efficient !== null ? (
								<>
									{cpu.cores.performance ?? 0}P / {cpu.cores.efficient ?? 0}E
								</>
							) : (
								cpu.cores.total
							)}
						</span>
					</td>
				))}
			</tr>
		),
	},
	threads: {
		title: "Threads",
		type: "number",
	},
	baseFrequency: {
		title: "Base Frequency",
		type: "number",
		unit: "Hz",
	},
	maxFrequency: {
		title: "Max Frequency",
		type: "number",
		unit: "Hz",
	},
	cache: {
		title: "Cache",
		type: "number",
		unit: "B",
	},
	tdp: {
		title: "TDP",
		type: "number",
		unit: "W",
		reverse: true,
	},
	lithography: {
		title: "Lithography",
		type: "string",
	},
	marketSegment: {
		title: "Market Segment",
		type: "custom",
		parse: (cpus) => (
			<tr key="marketSegment">
				<td className="p-2">Market Segment</td>
				{cpus.map((cpu) => {
					const hidePrice = cpu.marketSegment == "embedded" || (cpu.marketSegment == "mobile" && cpu.manufacturer == "amd");
					return (
						<td
							className={`p-2 ${hidePrice ? "text-center" : "text-center md:text-left"} `}
							key={cpu.name}
							rowSpan={hidePrice ? 2 : 1}
						>
							{capitalize(cpu.marketSegment || "N/A")}
						</td>
					);
				})}
			</tr>
		),
	},
	MSRP: {
		title: "Price",
		type: "custom",
		parse: (cpus) => (
			<tr key="MSRP">
				<td className="p-2">Price</td>
				{cpus.map((cpu, i) => {
					const hidePrice = cpu.marketSegment == "embedded" || (cpu.marketSegment == "mobile" && cpu.manufacturer == "amd");
					if (hidePrice) return <></>;

					return (
						<td className="p-2 text-center md:text-left" key={cpu.name}>
							<span className={colorDiff(cpu.MSRP, cpus[1 - i].MSRP, true)} id={"price-" + i}>
								{formatNumber(cpu.MSRP, "$")}
							</span>
						</td>
					);
				})}
			</tr>
		),
	},
	launchDate: {
		title: "Launch Date",
		type: "string",
	},
	memory: {
		types: {
			title: "types",
			type: "custom",
			parse: (cpus) => (
				<>
					<tr>
						<td colSpan={3} className="bg-gray-700 text-center text-xl uppercase text-gray-300">
							Memory
						</td>
					</tr>
					<tr>
						<td className="p-2">Memory Types</td>
						<MemoryComparison cpus={cpus} />
					</tr>
				</>
			),
		},
		maxSize: {
			title: "Max Size",
			type: "number",
			unit: "B",
		},
	},
	graphics: {
		title: "Graphics",
		type: "custom",
		parse: (cpus) => (
			<>
				<tr>
					<td colSpan={3} className="bg-gray-700 text-center text-xl uppercase text-gray-300">
						Graphics
					</td>
				</tr>
				{GraphicsComparison({ cpus })}
			</>
		),
	},
};

type FeatureList = {
	[key in keyof CPU]?: Feature | Record<string, Feature>;
};

type Feature = { title: string } & ( // Prefix is whether is to add K, M, G, etc. to the number
	| { type: "number"; unit?: string; prefix?: boolean; reverse?: boolean }
	| { type: "string" }
	| { type: "custom"; card?: true; parse: (cpus: CPU[]) => JSX.Element }
);

const MemoryComparison = ({ cpus }: { cpus: CPU[] }) => {
	const matchingTypes = cpus[0].memory.types
		.filter((type) => cpus[1].memory.types.some((type2) => type2?.type === type?.type))
		.map((type) => type?.type);

	const memorySpeeds = matchingTypes.map((type) => {
		const a = cpus[0].memory.types.find((type2) => type2?.type === type)?.speed as number;
		const b = cpus[1].memory.types.find((type2) => type2?.type === type)?.speed as number;
		return { type, a, b };
	});

	return (
		<>
			{cpus.map((cpu, i) => (
				<td className="p-2" key={cpu.name}>
					{memorySpeeds.map(({ type, a, b }) => (
						<Fragment key={type}>
							<span className={i % 2 ? colorDiff(b, a) : colorDiff(a, b)}>
								{type} at {cpu.name === cpus[0].name ? a : b} MHz
							</span>
							<br />
						</Fragment>
					))}
					{cpu.memory.types
						.filter((type) => !matchingTypes.includes(type?.type))
						.map((type) => (
							<Fragment key={type?.type}>
								<span>
									{type?.type} at {type?.speed} MHz
								</span>
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
			<tr>
				<td colSpan={3}>No graphics</td>
			</tr>
		);
	}

	return (
		<>
			<tr>
				<td>Base clock</td>
				{cpus.map((cpu, i) =>
					cpu.graphics !== false ? (
						<td
							key={cpu.name}
							className={colorDiff(
								(cpus[0].graphics as Graphics)?.baseFrequency,
								(cpus[1].graphics as Graphics)?.baseFrequency,
								i === 1
							)}
						>
							{formatNumber(cpu.graphics.baseFrequency, "Hz")}
						</td>
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
					(cpu, i) =>
						cpu.graphics !== false && (
							<td
								key={cpu.name}
								className={colorDiff(
									(cpus[0].graphics as Graphics)?.maxFrequency,
									(cpus[1].graphics as Graphics)?.maxFrequency,
									i === 1
								)}
							>
								{formatNumber(cpu.graphics.maxFrequency, "Hz")}
							</td>
						)
				)}
			</tr>
			<tr>
				<td>Max displays</td>
				{cpus.map(
					(cpu, i) =>
						cpu.graphics !== false && (
							<td
								key={cpu.name}
								className={colorDiff(
									(cpus[0].graphics as Graphics)?.displays,
									(cpus[1].graphics as Graphics)?.displays,
									i === 1
								)}
							>
								{cpu.graphics.displays || "Unknown"}
							</td>
						)
				)}
			</tr>
		</>
	);
};

const traverse = (obj: Record<string, any>, ...keys: string[]) => {
	let current = obj;
	for (const key of keys) {
		current = current[key];
	}
	return current;
};

export default Table;