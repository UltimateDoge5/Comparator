import { ImageResponse } from "@vercel/og";
import { fetchCPUEdge } from "../../../../util/fetchCPU";
import type { Cores, Manufacturer } from "../../../../../CPU";
import { Redis } from "@upstash/redis";
import { LogoIcon } from "../../../../components/icons";

const redis = Redis.fromEnv();
export const runtime = "edge";

export async function GET(req: Request, { params }: { params: { cpu: string } }) {
	const { cpu } = params;
	if (!cpu) return new Response("No CPU specified", { status: 400 });

	const data = await fetchCPUEdge(redis, cpu);

	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					background:
						"linear-gradient(153deg, rgba(3,105,161,1) 0%, rgba(0,8,13,1) 41%, rgba(0,0,0,1) 53%, rgba(109,40,217,1) 100%)",
					color: "white",
				}}
			>
				<div tw="flex absolute top-4 left-4">
					<LogoIcon height="64px" />
				</div>
				<div tw={`flex flex-col rounded-lg bg-white/20 border w-[90%] h-[75%] ${getManufacturerColor(data.manufacturer)}`}>
					<h1 tw="text-3xl">{data.name}</h1>
					<div tw="flex">
						<p>
							<FormatCores cores={data.cores} /> cores
						</p>
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

const FormatCores = ({ cores }: { cores: Cores }) => {
	if (cores.performance === null && cores.efficient === null) {
		return <span>{cores.total}</span>;
	} else if (cores.total === null) {
		return <span>Unknown</span>;
	}

	return (
		<>
			{cores.performance ?? 0}P / {cores.efficient ?? 0}E
		</>
	);
};

const getManufacturerColor = (manufacturer: Manufacturer) => {
	switch (manufacturer) {
		case "amd":
			return "shadow-red-500 border-red-600/80";
		case "intel":
			return "shadow-blue-500 border-blue-600/80";
	}
};
