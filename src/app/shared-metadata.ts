import type { Metadata } from "next";

export const openGraph: Metadata["openGraph"] = {
	type: "website",
	locale: "en_US",
	images: [
		{
			url: "/logo.png",
			width: 780,
			height: 256,
		},
	],
};

export const twitter: Metadata["twitter"] = {
	card: "summary_large_image",
	creator: "@UltimateDoge",
	images: [
		{
			url: "/logo.png",
			width: 780,
			height: 256,
		},
	],
};
