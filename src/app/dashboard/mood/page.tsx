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
import { format } from "date-fns";
import { binaryToFeels } from "@/lib/feel";

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
					<Link key={mood.id} href={`/dashboard/mood/${mood.id}`}>
						<Card>
							<CardHeader>
								<CardTitle>{format(new Date(mood.date), "PPP")}</CardTitle>
							</CardHeader>
							<CardContent>
								<section className="grid grid-cols-2 gap-2">
									<div className="underline font-semibold">Mood</div>
									<div>{mood.mood}</div>
									<div className="underline font-semibold">stress</div>
									<div>{mood.stress}</div>
									<div className="underline font-semibold">energy</div>
									<div>{mood.energy}</div>
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
