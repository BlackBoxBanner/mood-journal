import { ModeToggle } from "@/components/theme-toggle";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Mood Journal - Auth",
	description: "Mood Journal",
};

export default async function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<div className="absolute top-4 right-4">
				<ModeToggle />
			</div>
			{children}
		</>
	);
}
