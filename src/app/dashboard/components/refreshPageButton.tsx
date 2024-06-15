"use client";

import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

const RefreshPageButton = () => {
	const router = useRouter();
	return (
		<Button className="gap-2" type="button" onClick={() => router.refresh()}>
			<ReloadIcon />
			<span>Refresh</span>
		</Button>
	);
};

export default RefreshPageButton;
