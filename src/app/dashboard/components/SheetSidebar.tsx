"use client";

import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetClose,
} from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sidebar } from "./Sidebar";
import { useRef } from "react";

const SheetSidebar = ({ email }: { email: Readonly<string> }) => {
	const closeRef = useRef<HTMLButtonElement>(null);
	return (
		<Sheet>
			<SheetTrigger>
				<HamburgerMenuIcon />
			</SheetTrigger>
			<SheetContent side={"left"}>
				<Sidebar email={email} onClick={() => closeRef.current?.click()} />
			</SheetContent>
			<SheetClose className="hidden" ref={closeRef} />
		</Sheet>
	);
};

export default SheetSidebar;
