import type { Metadata } from "next";
import { Raleway, Playfair_Display, Sarabun } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Loading from "./loading";

const raleway = Raleway({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-raleway",
});

const playfairDisplay = Playfair_Display({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-playfair-display",
});

const sarabun = Sarabun({
	weight: ["100", "200", "300"],
	subsets: ["thai"],
	display: "swap",
	variable: "--font-sarabun",
});

export const metadata: Metadata = {
	title: "Mood Journal - Track Your Emotional Well-being",
	description:
		"Mood Journal is your personal space to record your mood, energy levels, and stress. Track what works and what doesn't in managing your emotional well-being with our easy-to-use journal.",

	generator: "Next.js",
	applicationName: "Mood Journal",
	referrer: "origin-when-cross-origin",
	keywords: [
		"Mood Journal",
		"mood",
		"emotion",
		"journal",
		"diary",
		"mental health",
		"wellness",
		"well-being",
		"self-care",
		"self-improvement",
		"productivity",
		"mindfulness",
		"gratitude",
		"happiness",
		"positivity",
		"anxiety",
		"depression",
		"stress",
		"therapy",
		"counseling",
		"psychology",
		"psychiatry",
		"mental illness",
		"mental disorder",
	],
	authors: [
		{
			name: "Sueksit Vachirakumthorn",
		},
	],
	creator: "Sueksit Vachirakumthorn",
	publisher: "Sueksit Vachirakumthorn",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					raleway.variable,
					playfairDisplay.variable,
					sarabun.variable,
					"font-sans bg-background text-foreground"
				)}
			>
				<Toaster />
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Suspense fallback={<Loading />}>{children}</Suspense>
				</ThemeProvider>
			</body>
		</html>
	);
}
