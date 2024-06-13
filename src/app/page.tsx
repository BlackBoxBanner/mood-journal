import Icon from "@/components/icon";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Home = async () => {
	return (
		<section
			className={cn(
				"min-h-dvh bg-background text-secondary-foreground font-sans antialiased grid grid-rows-[auto,1fr]"
			)}
		>
			<header
				className={cn(
					"flex justify-between items-center sticky top-0 backdrop-blur bg-background lg:bg-transparent px-8 py-4 z-10 shadow-md text-lg"
				)}
			>
				<Link href="/" className="flex gap-2 items-center justify-center">
					<Icon className="w-6" />
					<h1>{`Mood Journal`}</h1>
				</Link>
				<ModeToggle />
			</header>
			<div className="h-full flex justify-center items-center flex-col p-8 gap-8">
				<div className="text-[2rem] sm:text-[4rem] text-center flex items-center justify-center gap-4 font-light">
					<Icon className="w-14" />
					Mood Journal
				</div>
				<Link href={"/auth"} legacyBehavior passHref prefetch={false}>
					<Button size={"lg"}>Start your Journal</Button>
				</Link>
			</div>
		</section>
	);
};

export default Home;
