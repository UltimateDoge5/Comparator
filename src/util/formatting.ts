export const formatNumber = (num: number | null, unit: string) => {
	if (num === null) return "N/A " + unit;

	const prefixes = ["", "K", "M", "G", "T"];
	const prefix = prefixes[Math.floor(Math.log10(num) / 3)];
	const value = num / Math.pow(10, prefixes.indexOf(prefix) * 3);
	return `${value % 1 !== 0 ? value.toFixed(2) : value} ${prefix}${unit}`;
};

export const colorDiff = (a: number | null, b: number | null, invert = false) => {
	if (a === b) return "text-gray-50";
	if ((a === null || a === undefined) || (b === null || b === undefined)) return "text-yellow-500";
	return (invert ? b > a : a > b) ? "text-green-500" : "text-red-500";
};