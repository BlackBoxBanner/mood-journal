import { getSession } from "@/lib/auth";
import { getUniqueUserWithMood } from "@/lib/prisma/query/user";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { add, format, isAfter, isBefore, sub } from "date-fns";
import { binaryToFeels } from "@/lib/feel";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const isTenDaysAgo = (date: Date) => {
	return isAfter(date, sub(new Date(), { days: 10 }));
};

const MoodPage = async () => {
	const session = await getSession();
	const email = session.email;

	if (!email) {
		return <div>Redirecting...</div>;
	}

	const user = await getUniqueUserWithMood({
		where: {
			email,
		},
	});

	if (!user) {
		return <div>User not found</div>;
	}
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{user.Mood.map((mood) => {
				return (
					<Link
						key={mood.id}
						href={`/dashboard/mood/${mood.id}`}
						className="relative"
					>
						{mood.isNew && isTenDaysAgo(mood.date) ? (
							<Badge variant="outline" className="absolute top-2 right-2">
								New
							</Badge>
						) : null}

						<Card className="hover:shadow-lg ease-in-out duration-300 h-full">
							<CardHeader>
								<CardTitle>{format(new Date(mood.date), "PPP")}</CardTitle>
							</CardHeader>
							<CardContent>
								<section className="grid grid-cols-2 gap-2">
									<div className="underline font-semibold">Mood</div>
									<div>{mood.mood}</div>
									<div className="underline font-semibold">stress</div>
									<div className="flex gap-2 justify-center items-center">
										<Progress value={mood.stress * 10} />
										<span className="bg-muted rounded px-4">{mood.stress}</span>
									</div>
									<div className="underline font-semibold">energy</div>
									<div className="flex gap-2 justify-center items-center">
										<Progress value={mood.energy * 10} />
										<span className="bg-muted rounded px-4">{mood.energy}</span>
									</div>
									<div className="col-span-2 underline font-semibold">
										What did you feel?
									</div>
									<div className="col-span-2 flex flex-wrap gap-2">
										{binaryToFeels(mood.feel).map((value, index) => {
											return (
												<span
													key={`${value}-${index}`}
													className={"bg-muted px-2 rounded"}
												>
													{value}
												</span>
											);
										})}
									</div>
								</section>
							</CardContent>
						</Card>
					</Link>
				);
			})}
		</div>
	);
};

export default MoodPage;
