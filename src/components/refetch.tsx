"use client";
import { ReloadIcon } from "./icons";
import { useEffect, useState } from "react";
import { domAnimation, LazyMotion, m, useTime, useTransform } from "framer-motion";

const Refetch = ({ modelPath }: { modelPath: string }) => {
	const time = useTime();
	const rotate = useTransform(time, [0, 2000], [0, 360], { clamp: false });
	const [refetch, setRefetch] = useState(false);

	useEffect(() => {
		const url = new URL(location.toString());
		if (url.searchParams.has("refetch")) {
			url.searchParams.delete("refetch");
			location.replace(url.toString());
		}
	}, []);

	return (
		<a
			className="flex items-center justify-center gap-1 rounded-md border border-gray-400/20 bg-gray-400/20 p-2 transition-all hover:bg-gray-200/50"
			href={`/cpu/${modelPath}?refetch=true`}
			onClick={() => !refetch && setRefetch(true)}
		>
			<LazyMotion features={domAnimation}>
				<m.div style={{ rotate: refetch ? rotate : 0 }}>
					<ReloadIcon className="h-5 w-5" />
				</m.div>
			</LazyMotion>
			Refetch
		</a>
	);
};

export default Refetch;
