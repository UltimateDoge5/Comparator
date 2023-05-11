import { ImageResponse } from "@vercel/og";
import { fetchCPUEdge } from "../../../../util/fetchCPU";
import { Redis } from "@upstash/redis";
import { LogoIconBlack } from "../../../../components/icons";

const redis = Redis.fromEnv();
export const runtime = "edge";

export async function GET(req: Request, { params }: { params: { cpu: string } }) {
	const { cpu } = params;
	if (!cpu) return new Response("No CPU specified", { status: 400 });

	const data = await fetchCPUEdge(redis, cpu, false);

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#fff",
					color: "#333",
				}}
			>
				<LogoIconBlack style={{ width: "1026px", height: "250px" }} />
				<h1 tw="text-center text-5xl">
					{data.name}
				</h1>
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	);
}