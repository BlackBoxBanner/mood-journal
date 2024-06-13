"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import Link from "next/link";

type NavPath = {
	title: string;
	path: string;
};
const path: NavPath[] = [
	{
		title: "Dashboard",
		path: "/dashboard",
	},
	{
		title: "Calendar",
		path: "/dashboard/calendar",
	},
	{
		title: "mood",
		path: "/dashboard/mood",
	},
];

export const Sidebar = ({
	email,
	onClick,
}: {
	email: Readonly<string>;
	onClick?: () => void;
}) => {
	// const session = await getSession();
	const pathname = usePathname();

	const router = useRouter();

	const signOutHandler = async () => {
		fetch("/api/auth/signout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		router.refresh();
		router.push("/");
		return;
	};

	return (
		<aside className="bg-background text-secondary-foreground lg:border-r w-full h-full flex justify-between flex-col">
			<div className="flex flex-col relative w-full lg:py-4 ">
				{path.map((item, index) => {
					return (
						<Link key={index} href={item.path} passHref legacyBehavior>
							<Button
								className="w-full rounded-none flex justify-between h-12 px-8 gap-4 text-base font-normal"
								variant={"ghost"}
								onClick={onClick}
							>
								{item.title}
								{pathname === item.path && (
									<CheckIcon className="hidden lg:flex" />
								)}
							</Button>
						</Link>
					);
				})}
			</div>
			<div className=" border-t lg:mb-4">
				<p className=" px-8 py-2 overflow-clip truncate">{email}</p>
				<Button
					className="w-full rounded-none flex justify-between h-12 px-8 gap-4 text-base font-normal"
					variant={"ghost"}
					onClick={signOutHandler}
				>
					Sign out
				</Button>
			</div>
		</aside>
	);
};
