import { ImageResponse } from "@vercel/og";
import { fetchCPUEdge } from "../../../../util/fetchCPU";
import type { Cores, Manufacturer } from "../../../../../CPU";
import { Redis } from "@upstash/redis";
import { LogoIconBlack } from "../../../../components/icons";
import { formatNumber } from "../../../../util/formatting";

const redis = Redis.fromEnv();
export const runtime = "edge";

export async function GET(req: Request, { params }: { params: { cpu: string } }) {
	const { cpu } = params;
	if (!cpu) return new Response("No CPU specified", { status: 400 });

	const data = await fetchCPUEdge(redis, cpu);

	const accent = data.manufacturer === "intel" ? "rgba(59,130,246,0.2)" : "rgba(244,63,94,0.2)";

	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#FEFFFF",
					color: "#333333",
				}}
			>
				<div tw="flex absolute top-4 left-4">
					<LogoIconBlack height="64px" />
				</div>
				<div
					tw={`flex flex-col p-4 rounded-lg bg-white/20 border w-[90%] h-[75%] mt-4 shadow-md
					 ${getManufacturerColor(data.manufacturer)} `}
					style={{ background: `linear-gradient(135deg, ${accent} 10%, rgba(255,255,255,0.1) 100%)` }}
				>
					<h1 tw="text-3xl">{data.name}</h1>
					<div tw="flex gap-8 w-full flex-wrap text-xl" style={{ gap: "4rem" }}>
						<FormatCores cores={data.cores} />
						<FormatFrequency base={data.baseFrequency} max={data.maxFrequency} />
					</div>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	);
}

const FormatFrequency = ({ base, max }: { base: number | null; max: number | null }) => {
	if (!max) {
		return (
			<span>
				Frequency: {formatNumber(base, "Hz")}/{formatNumber(max, "Hz")}
			</span>
		);
	}

	if (!base) {
		return <span> Max Frequency: {formatNumber(max, "Hz")}</span>;
	}

	return <span> Base Frequency: {formatNumber(base, "Hz")} </span>;
};

const FormatCores = ({ cores }: { cores: Cores }) => {
	if (cores.performance === null && cores.efficient === null) {
		return <span>Cores: {cores.total}</span>;
	} else if (cores.total === null) {
		return <span>Cores: Unknown</span>;
	}

	return (
		<span>
			Cores: {cores.performance ?? 0}P / {cores.efficient ?? 0}E
		</span>
	);
};

const getManufacturerColor = (manufacturer: Manufacturer) => {
	switch (manufacturer) {
		case "amd":
			return "shadow-red-500 border-red-400/80";
		case "intel":
			return "shadow-blue-500 border-blue-400/80";
	}
};
