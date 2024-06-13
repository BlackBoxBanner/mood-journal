import moodIcon from "@/components/icon/moodIcon.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Icon = ({ className }: { className?: Readonly<string> }) => {
	return (
		<div className={cn("aspect-square w-10 relative", className)}>
			<Image src={moodIcon} alt="" fill />
		</div>
	);
};

export default Icon;
