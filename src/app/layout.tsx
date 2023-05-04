import "../styles/globals.css";
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
            <body className="grid min-h-screen grid-rows-[64px,1fr,112px] bg-gradient bg-cover md:grid-rows-[64px,1fr,10vh] [&>div]:min-h-screen">
	            {children}
	            <Analytics />
			</body>
        </html>
	);
}