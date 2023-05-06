import { test, expect } from "vitest";
import scrapeAMD from "../src/util/scrapers/amd";
import scrapeIntel from "../src/util/scrapers/intel";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

test(
	"Intel cpu - cache",
	async () => {
		const cpu = await scrapeIntel(redis, "core i5 7400", false);
		expect(cpu != null).toBe(true);
	},
	{ timeout: 10000 },
);

test(
	"Intel cpu - no cache",
	async () => {
		const cpu = await scrapeIntel(redis, "core i5 7400", true);
		expect(cpu != null).toBe(true);
	},
	{ timeout: 10000 },
);

test(
	"AMD cpu - cache",
	async () => {
		const cpu = await scrapeAMD(redis, "amd ryzen 5 3600", false);
		expect(cpu != null).toBe(true);
	},
	{ timeout: 10000 },
);

test(
	"AMD cpu - no cache",
	async () => {
		const cpu = await scrapeAMD(redis, "amd ryzen 5 3600", true);
		expect(cpu != null).toBe(true);
	},
	{ timeout: 15000 },
);
