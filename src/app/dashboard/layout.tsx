import { ModeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Sidebar } from "@/app/dashboard/components/Sidebar";
import React from "react";
import { getSession } from "@/lib/auth";

const DashboardLayout = async ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const session = await getSession();
	const email = session.email;
	return (
		<section
			className={cn(
				"min-h-dvh bg-background text-secondary-foreground font-sans antialiased",
				"grid grid-rows-[auto,1fr] grid-cols-1"
			)}
		>
			<header
				className={cn(
					"flex justify-between items-center sticky top-0 backdrop-blur bg-background lg:bg-transparent px-8 py-4 z-10 shadow text-lg col-span-2 border-b"
				)}
			>
				<div className="flex justify-center gap-4">
					<div className="lg:hidden flex">
						<Sheet>
							<SheetTrigger>
								<HamburgerMenuIcon />
							</SheetTrigger>
							<SheetContent side={"left"}>
								<Sidebar email={email} />
							</SheetContent>
						</Sheet>
					</div>
					<Link href="/">
						<h1>{`Mood Journal`}</h1>
					</Link>
				</div>
				<ModeToggle />
			</header>
			<div className="hidden lg:flex fixed w-[250px] h-full pt-[60px]">
				<Sidebar email={email} />
			</div>
			<div className="p-8 relative h-full lg:ml-[250px]">
				<div className="">{children}</div>
			</div>
		</section>
	);
};

export default DashboardLayout;
