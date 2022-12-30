export interface CPU {
	name: string;
	lithography: string;
	manufacturer: string;
	cores: Cores;
	cache: string;
	threads: number;
	baseFrequency: number;
	maxFrequency: number;
	tdp: number;
	launchDate: string;
	memory: Memory;
	graphics: boolean;
	pcie: string;
	"64bit": boolean;
}

export interface Cores {
	total: number;
	efficient: number;
	performance: number;
}

export interface Memory {
	type: string;
	maxSize: number;
}
