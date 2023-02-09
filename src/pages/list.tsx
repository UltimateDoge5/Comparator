import Footer from "../components/footer";

const List = () => {

	return (
		<>
			<div className="flex min-h-[90vh] w-full flex-col items-center gap-6 text-white">
				<h1 className="text-4xl">Search for CPUs</h1>
				<input
					type="search"
					className="h-14 w-1/2 rounded-md border border-gray-400 bg-slate-700 p-2 text-xl text-white shadow-lg"
					placeholder="Search for a CPU"
				/>
			</div>
			<Footer />
		</>

	);
};

export default List;