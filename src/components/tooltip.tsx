const Tooltip = ({ tip }: { tip: string }) => {


	return (
		<div className="relative inline-block text-left">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="peer h-4 w-4 cursor-help">
				<path
					fillRule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z"
					clipRule="evenodd"
				/>
			</svg>

			<div className="absolute top-full z-10 w-max max-w-md rounded-md bg-gray-800 p-2 text-sm text-white opacity-0 transition-all peer-hover:opacity-100">
				{tip}
			</div>
		</div>
	);
};

export default Tooltip;