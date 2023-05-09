import type { Metadata } from "next";

export const openGraph: Metadata["openGraph"] = {
	type: "website",
	locale: "en_US",
	images: [
		{
			url: "/banner.png",
			width: 1200,
			height: 628,
		},
	],
};

export const twitter: Metadata["twitter"] = {
	card: "summary_large_image",
	creator: "@UltimateDoge",
	images: [
		{
			url: "/banner.png",
			width: 1200,
			height: 628,
		},
	],
};
