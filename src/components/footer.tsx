const Footer = () => (
	<footer className="flex h-full w-full flex-col items-center gap-x-4 gap-y-2 border-t bg-slate-700/25 py-4 text-center md:flex-row md:justify-center">
		<p className="text-white">
			Made by
			<a className="text-blue-500" href="https://pkozak.org" target="_blank">
				Piotr Kozak
			</a>
		</p>

		<p className="text-white">
			Source code available on
			<a className="text-blue-500" href="https://github.com/UltimateDoge5/Comparator" target="_blank" rel="noreferrer">
				GitHub
			</a>
		</p>
		<iframe
			src="https://ghbtns.com/github-btn.html?user=UltimateDoge5&repo=comparator&type=star&count=true"
			width="72"
			height="20"
			title="GitHub"
		/>
	</footer>
);

export default Footer;
