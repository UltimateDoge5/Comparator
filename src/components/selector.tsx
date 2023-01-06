import type { CPU, Manufacturer } from "../../types";
import { Fragment, useEffect, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import fetchCPU from "../util/fetchCPU";

const Selector = ({ setCPU, urlId }: SelectorProps) => {
	const [selection, setSelection] = useState<Selection>({ manufacturer: "intel", model: "", state: "idle" });
	const [countdownBarPercent, setCountdownBarPercent] = useState(100);
	const [tempModel, setTempModel] = useState("");

	const intervalRef = useRef(0);
	const barVisible = tempModel !== selection.model && tempModel.length > 3 && selection.state !== "loading";

	// Handle the countdown bar
	useEffect(() => {
		if (selection.state === "loading") return () => clearInterval(intervalRef.current);

		if (barVisible) {
			let percent = 100;
			intervalRef.current = window.setInterval(async () => {
				percent -= 1;
				if (percent <= 0) {
					clearInterval(intervalRef.current);
					// No need to await this
					setSelection({ ...selection, model: tempModel, state: "loading" });
				}
				setCountdownBarPercent(percent);
			}, 17);
		}

		return () => window.clearInterval(intervalRef.current);
	}, [barVisible, selection.state, tempModel]);

	// Load the model from the URL
	useEffect(() => {
		const url = new URL(window.location.href);
		const param = url.searchParams.get(urlId);

		if (param) {
			const [manufacturer, model] = param.split("-").map((s) => decodeURIComponent(s));
			setTempModel(decodeURIComponent(model));
			setSelection({ manufacturer: manufacturer as Manufacturer, model, state: "loading" });
			// fetchWrapper(manufacturer.toLowerCase() as Manufacturer, model);
		}
	}, []);

	// Fetch the CPU
	useEffect(() => {
		if (selection.model.length > 3) {
			setSelection({ ...selection, state: "loading" });
			fetchCPU(selection.manufacturer, selection.model).then((cpu) => {
				if (cpu.error) {
					setSelection({ ...selection, state: "error" });
					return;
				}

				// Update the URL after successful fetch
				const url = new URL(window.location.href);
				url.searchParams.set(urlId, `${encodeURIComponent(selection.manufacturer)}-${encodeURIComponent(selection.model)}`);
				window.history.pushState({}, "", url.toString());

				setSelection({ ...selection, state: "success" });
				setCPU(cpu.data);
			});
		}
	}, [selection.model]);

	return (
		<div className={`flex items-center gap-4 rounded-md border transition-colors bg-white bg-opacity-10 p-4 relative ${getMarkings(selection.state)}`}>
			<select
				value={selection.manufacturer}
				disabled={selection.state === "loading"}
				className="rounded-md bg-gray-200 p-2 disabled:opacity-75 disabled:cursor-not-allowed"
				onChange={(e) => {
					setSelection({ ...selection, model: "", manufacturer: e.target.value as Manufacturer });
					setTempModel("");
				}}
			>
				<option value="intel">Intel</option>
				<option value="amd">AMD</option>
			</select>
			<input
				value={tempModel}
				disabled={selection.state === "loading"}
				onChange={(e) => setTempModel(e.target.value)}
				placeholder={selection.manufacturer === "intel" ? "i5-5400" : "Ryzen 7 5800H"}
				className="rounded-md bg-gray-200 p-2 disabled:opacity-75 disabled:cursor-not-allowed"
			/>
			<Transition
				as={Fragment}
				show={barVisible}
				enter="transition-opacity duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div style={{ width: countdownBarPercent + "%" }} className={`absolute bottom-0 left-0 rounded-b h-0.5 bg-blue-400`}></div>
			</Transition>
		</div>
	);
};
// Get the border color based on the state
const getMarkings = (state: Selection["state"]) => {
	switch (state) {
		case "loading":
			return "border-yellow-500 hover:border-yellow-400";
		case "error":
			return "border-red-500 hover:border-red-400";
		case "success":
			return "border-green-500 hover:border-green-400";
		default:
			return "border-gray-500 hover:border-gray-400";
	}
};

interface SelectorProps {
	setCPU: (cpu: CPU | null) => void,
	urlId: string
}

export interface Selection {
	manufacturer: Manufacturer;
	state: "idle" | "loading" | "error" | "success";
	model: string;
}

export default Selector;