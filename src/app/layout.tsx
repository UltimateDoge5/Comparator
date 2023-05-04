import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
            <body className="grid min-h-screen grid-rows-[64px,1fr,112px] bg-gradient bg-cover md:grid-rows-[64px,1fr,10vh] [&>div]:min-h-screen">
	            <Navbar />
	            {children}
	            <Footer />
	            <Analytics />
			</body>
        </html>
	);
}