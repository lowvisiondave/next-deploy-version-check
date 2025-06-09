import type { Metadata } from "next";
import "./globals.css";
import { VersionSkewBanner } from "@/components/version-skew-banner";

export const metadata: Metadata = {
	title: "Version Skew Demo",
	description:
		"This app automatically detects when a new production deployment is live.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				{children}
				<VersionSkewBanner />
			</body>
		</html>
	);
}
