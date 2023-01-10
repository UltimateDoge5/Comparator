import type { CPU, Manufacturer } from "../../types";
import { Fragment, useEffect, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import fetchCPU from "../util/fetchCPU";

const Selector = ({ setCPU, urlId }: SelectorProps) => {
	const [selection, setSelection] = useState<Selection>({ manufacturer: "intel", model: "", state: "idle" });
	const [tempModel, setTempModel] = useState("");
	const [countdownBarPercent, setCountdownBarPercent] = useState(100);

	const [searchResults, setSearchResults] = useState<string[]>([]);
	const [showResults, setShowResults] = useState(false);

	const searchRef = useRef(0);
	const intervalRef = useRef(0);
	const barVisible = tempModel !== selection.model && tempModel.length > 3 && selection.state !== "loading";

	const omittedSearch = searchResults.filter((r) => r !== tempModel);
	const searchTipVisible = showResults && searchResults.length > 0;


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

	// Manage the search results
	useEffect(() => {
		if (selection.state !== "loading" && tempModel.length > 3) {
			// Cancel the previous search
			clearTimeout(searchRef.current);

			// Start a new search
			searchRef.current = window.setTimeout(async () => {
				await fetch(`/api/cpu/search?manufacturer=${selection.manufacturer}&model=${tempModel}`)
					.catch(() => setSearchResults([]))
					.then(res => res?.json())
					.then(res => {
						setSearchResults(res);
					});
			}, 350);
		}
	}, [selection, tempModel]);

	return (
		<div className={`flex items-center gap-4 rounded-md border transition-colors bg-opacity-10 p-4 relative ${getMarkings(selection.state)}`}>
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
			<div className="relative">
				<input
					value={tempModel}
					disabled={selection.state === "loading"}
					onFocus={() => setShowResults(true)}
					onBlur={() => setShowResults(false)}
					onChange={(e) => setTempModel(e.target.value)}
					placeholder={selection.manufacturer === "intel" ? "i5-5400" : "Ryzen 7 5800H"}
					className="rounded-md bg-gray-200 p-2 disabled:opacity-75 disabled:cursor-not-allowed"
				/>

				<Transition
					as={Fragment}
					show={searchTipVisible}
					unmount={false}
					enter="transition-opacity duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity duration-300"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div
						className={`absolute flex divider-y top-full bg-white rounded-md shadow-md p-2 z-20 w-max transition-all ${previewPositions[omittedSearch.length - 1]}`}
					>
						{omittedSearch.map((result) => (
							<div
								key={result}
								className="p-2 rounded-md hover:bg-gray-300 focus:bg-gray-200 cursor-pointer"
								onClick={() => {
									setTempModel(result);
									setShowResults(false);
								}}
							>
								{result}
							</div>
						))}
					</div>
				</Transition>
			</div>

			<Transition
				as={Fragment}
				appear={true}
				show={barVisible}
				enter="transition-opacity duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div
					style={{ width: countdownBarPercent + "%" }}
					className={`absolute ${searchTipVisible ? "top-0 rounded-t" : "bottom-0 rounded-b"} left-0 h-0.5 bg-blue-400 z-0`}
				></div>
			</Transition>
		</div>
	);
};

const previewPositions = ["", "-left-1/4", "-left-1/2"];

// Get the border color based on the state
const getMarkings = (state: Selection["state"]) => {
	switch (state) {
		case "loading":
			return "bg-yellow-400 border-yellow-500 hover:border-yellow-400";
		case "error":
			return "bg-red-400 border-red-500 hover:border-red-400";
		case "success":
			return "bg-green-400 border-green-500 hover:border-green-400";
		default:
			return "bg-white border-gray-500 hover:border-gray-400";
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