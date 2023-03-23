import Link from "next/link";

const Navbar = () => (
	<nav className="h-16 w-full bg-gray-200/5 backdrop-blur-sm">
		<div className="mx-auto flex h-full w-full items-center justify-between px-4 text-white">
			<div className="flex items-center">
				<h1 className="text-2xl font-bold uppercase italic text-white">
					<Link href="/">PrimeCPU</Link>
				</h1>
			</div>
			<div className="flex items-center">
				<Link href="/" className="rounded-md px-4 py-2 text-lg font-semibold hover:bg-gray-800/60">Comparison</Link>
				<Link href="/list" className="rounded-md px-4 py-2 text-lg font-semibold hover:bg-gray-800/60">List</Link>
			</div>
		</div>
	</nav>
);

export default Navbar;