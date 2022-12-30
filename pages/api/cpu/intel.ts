import { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { name } = req.query;

	// Get the url
	const query = await fetch("https://platform.cloud.coveo.com/rest/search/v2?f:@tabfilter=[Products]", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			// Temporary solution for testing
			Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJmaWx0ZXIiOiJOT1QgQHBhcnRuZXJ0YXJnZXQiLCJ1c2VyR3JvdXBzIjpbIlU6UHVibGljIiwiYW5vbnltb3VzIl0sInNlYXJjaEh1YiI6ImVudGVwcmlzZVNlYXJjaCIsInY4Ijp0cnVlLCJvcmdhbml6YXRpb24iOiJpbnRlbGNvcnBvcmF0aW9ucHJvZHVjdGlvbmU3OG4yNXM2IiwidXNlcklkcyI6W3sicHJvdmlkZXIiOiJFbWFpbCBTZWN1cml0eSBQcm92aWRlciIsIm5hbWUiOiJhbm9ueW1vdXMiLCJ0eXBlIjoiVXNlciJ9XSwicm9sZXMiOlsicXVlcnlFeGVjdXRvciJdLCJleHAiOjE2NzI1MDIwNTIsImlhdCI6MTY3MjQxNTY1Mn0.LO4_DHszF2iDR5nr67f5VIPCeU7zhdOYFncBk40pAlo"
		},
		body: JSON.stringify({
			q: name,
			numberOfResults: 1
		})
	});

	if (!query.ok) {
		console.error(await query.text());
		res.status(500).end();
		return;
	}

	const data = await query.json();

	const url = data.results[0].clickUri;
	console.log("Fetching page: ", url);

	// Get the data
	const page = await fetch(url);

	if (!page.ok) {
		console.error(await page.text());
		res.status(500).send("Error while fetching the CPU data");
		return;
	}

	const $ = load(await page.text());

	// Helper function to get specific data
	const getParameter = (name: string) => {
		const selector = $(".tech-label span");
		let label = selector.filter((i, el) => $(el).text() === name);

		if (label.length === 0) {
			label = selector.filter((i, el) => $(el).text().includes(name));
		}

		if (label.length === 0) {
			return null;
		}

		return label.parent().parent().find(".tech-data span").text();
	};

	const cpu = {
		name: getParameter("Processor Number"),
		lithography: (() => getParameter("Lithography")?.replace("nm", "")?.trim())(),
		cores: parseInt(getParameter("Total Cores")?.split(" ")[0] ?? "-1"),
		threads: parseInt(getParameter("Total Threads")?.split(" ")[0] ?? "-1"),
		baseFrequency: parseFloat(getParameter("Processor Base Frequency")?.split(" ")[0] ?? "-1"),
		maxFrequency: parseFloat(getParameter("Max Turbo Frequency")?.split(" ")[0] ?? "-1"),
		tdp: parseInt(getParameter("TDP")?.split(" ")[0] ?? "-1"),
		launchDate: (() => {
			const date = getParameter("Launch Date");

			const [quarter, year] = date?.split("'") ?? [];

			if (!quarter || !year) {
				return null;
			}

			return {
				quarter: quarter.trim(),
				year: parseInt(year.trim())
			};
		})(),
		memory: {
			type: (() => {
				const type = getParameter("Memory Types");

				if (!type) {
					return null;
				}

				return type.split(",").map(t => t.trim());
			})(),
			channels: parseInt(getParameter("Max # of Memory Channels")?.split(" ")[0] ?? "-1"),
			maxCapacity: parseInt(getParameter("Max Memory Size")?.split(" ")[0] ?? "-1")
		},
		graphics: {
			baseFrequency: parseFloat(getParameter("Graphics Base Frequency")?.split(" ")[0] ?? "-1"),
			maxFrequency: parseFloat(getParameter("Graphics Max Dynamic Frequency")?.split(" ")[0] ?? "-1"),
			maxMemory: parseInt(getParameter("Graphics Max Memory")?.split(" ")[0] ?? "-1"),
			directX: getParameter("DirectX* Support"),
			opengl: getParameter("OpenGL* Support")
		},
		pcie: getParameter("PCI Express Revision"),
		"64bit": getParameter("Instruction Set") === "Yes",
	};

	res.status(200).json(cpu);
};


export default handler;