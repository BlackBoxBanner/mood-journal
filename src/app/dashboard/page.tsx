import { getSession } from "@/lib/auth";
import { permanentRedirect } from "next/navigation";
import { getUniqueUser } from "@/lib/prisma/query/user";
import { getManyMood } from "@/lib/prisma/query/mood";
import { Mood } from "@prisma/client";
import EnergyAndStressLevelChart from "@/app/dashboard/components/EnergyAndStressLevelChart";
import MoodOverTimeChart from "@/app/dashboard/components/MoodOverTimeChart";

const DashboardPage = async () => {
	const session = await getSession();

	if (!session.email) return permanentRedirect("/");

	const user = await getUniqueUser({
		where: {
			email: session.email,
		},
	});

	if (!user) return permanentRedirect("/");

	const moods = await getManyMood({
		take: 30,
		where: {
			userId: user.id,
		},
		orderBy: {
			date: "asc",
		},
	});

	const chartMoodData = prepareData(moods);

	return (
		<div className="flex flex-col gap-8">
			<EnergyAndStressLevelChart moods={chartMoodData} />
			<MoodOverTimeChart moods={chartMoodData} />
		</div>
	);
};

export default DashboardPage;

const prepareData = (moods: Readonly<Mood[]>) => {
	function addDays(date: Date, days: number): Date {
		const result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}

	const startDate = new Date(moods[0] ? moods[0].date : new Date());
	const endDate = new Date(
		moods[0] ? moods[moods.length - 1].date : new Date()
	);
	const dateArray: Date[] = [];
	let currentDate = startDate;

	while (currentDate <= endDate) {
		dateArray.push(new Date(currentDate));
		currentDate = addDays(currentDate, 1);
	}

	const moodMap = new Map<string, Mood>(
		moods.map((mood) => [mood.date.toISOString().split("T")[0], mood])
	);

	const chartMoodData: Partial<Omit<Mood, "userId">>[] = dateArray.map(
		(date) => {
			const dateString = date.toISOString().split("T")[0];
			if (moodMap.has(dateString)) {
				return moodMap.get(dateString) as Mood;
			} else {
				// Fill with default mood data
				return {
					id: "",
					date: date,
					mood: undefined, // or any default value
					stress: NaN, // or any default value
					energy: NaN, // or any default value
					well: "",
					notWell: "",
					feel: NaN, // or any default value
					activities: "",
					grateful: "",
				};
			}
		}
	);

	return chartMoodData;
};
