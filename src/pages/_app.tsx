import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

import "../../node_modules/react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<Component {...pageProps} />
			<Analytics />
		</>
	);
}
