export interface CPU {
	name: string | null;
	// MSRP: number | null;
	lithography: string | null;
	manufacturer: Manufacturer;
	cores: Cores;
	cache: number | null;
	threads: number | null;
	baseFrequency: number | null;
	maxFrequency: number | null;
	tdp: number | null;
	launchDate: string;
	memory: Memory;
	graphics: false | Graphics;
	pcie: string | null;
	"64bit": boolean;
	source: string;
	schemaVer: number;
}

interface Cores {
	total: number | null;
	efficient: number | null;
	performance: number | null;
}

interface Memory {
	type: string | null;
	maxSize: number | null;
}

interface Graphics {
	baseFrequency: number | null;
	maxFrequency: number | null;
	displays: number | null;
}

export const Manufacturer = {
	INTEL: "intel",
	AMD: "amd"
} as const;

export type Manufacturer = typeof Manufacturer[keyof typeof Manufacturer];