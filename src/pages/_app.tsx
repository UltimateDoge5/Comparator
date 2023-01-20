import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

import "../../node_modules/react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Component {...pageProps} />
			<Analytics />
		</>
	);
}
