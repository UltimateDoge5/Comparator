import Link from "next/link";

const Navbar = () => (
	<nav className="h-16 w-full bg-gray-200/5 backdrop-blur-sm">
		<div className="mx-auto flex h-full w-full items-center justify-between px-4 text-white">
			<div className="flex items-center">
				<h1 className="text-2xl font-bold uppercase italic text-white">
					<Link href="/">PrimeCPU</Link>
				</h1>
			</div>
			<div className="flex items-center gap-2">
				<Link href="/" className="rounded-md px-1 py-2 text-lg font-semibold transition-all hover:bg-gray-300/20 md:px-4">
					Comparison
				</Link>
				<Link href="/list" className="rounded-md px-1 py-2 text-lg font-semibold transition-all hover:bg-gray-300/20 md:px-4">
					List
				</Link>
			</div>
		</div>
	</nav>
);

export default Navbar;
