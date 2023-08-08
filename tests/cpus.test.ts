import { expect, test } from "vitest";
import scrapeAMD from "../src/util/scrapers/amd";
import scrapeIntel from "../src/util/scrapers/intel";
import { Redis } from "@upstash/redis";
import type { CPU } from "../CPU";

const redis = Redis.fromEnv();
const nullThreshold = 6;

test(
	"Intel cpu - cache",
	async () => {
		const result = await scrapeIntel(redis, "core i5 7400", false);
		if (result.cpu === null) console.error(result.error);
		expect(result.cpu !== null).toBe(true);
		expect(sumNullsInCPU(result.cpu!)).toBeLessThanOrEqual(nullThreshold);
	},
	{ timeout: 10000 }
);

// For some reason, this fails only in tests
test(
	"Intel cpu - no cache",
	async () => {
		const result = await scrapeIntel(redis, "core i5 7400", true);
		if (result.cpu === null) console.error(result.error);
		expect(result.cpu !== null).toBe(true);
		expect(sumNullsInCPU(result.cpu!)).toBeLessThanOrEqual(nullThreshold);
	},
	{ timeout: 10000 }
);

test(
	"AMD cpu - cache",
	async () => {
		const result = await scrapeAMD(redis, "amd ryzen 5 3600", false);
		if (result.cpu === null) console.error(result.error);
		expect(result.cpu !== null).toBe(true);
		expect(sumNullsInCPU(result.cpu!)).toBeLessThanOrEqual(nullThreshold);
	},
	{ timeout: 10000 }
);

// For some reason, this fails only in tests
test(
	"AMD cpu - no cache",
	async () => {
		const result = await scrapeAMD(redis, "amd ryzen 5 3600", true);
		if (result.cpu === null) console.error(result.error);
		expect(result.cpu !== null).toBe(true);
		expect(sumNullsInCPU(result.cpu!)).toBeLessThanOrEqual(nullThreshold);
	},
	{ timeout: 20000 }
);

const sumNullsInCPU = (cpu: CPU) => {
	let sum = 0;
	for (const key in cpu) {
		if (cpu[key as keyof CPU] == null) {
			sum += 1;
		}
	}
	return sum;
};
