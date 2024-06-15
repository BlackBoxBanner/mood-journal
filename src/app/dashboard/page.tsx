import { getSession } from "@/lib/auth";
import { permanentRedirect } from "next/navigation";
import { getUniqueUser } from "@/lib/prisma/query/user";
import { getManyMood } from "@/lib/prisma/query/mood";
import { Mood } from "@prisma/client";
import EnergyAndStressLevelChart from "@/app/dashboard/components/EnergyAndStressLevelChart";
import MoodOverTimeChart from "@/app/dashboard/components/MoodOverTimeChart";
import { differenceInDays, addDays, format, isSameDay } from "date-fns";

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
		where: {
			userId: user.id,
		},
		orderBy: {
			date: "desc",
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

const prepareData = (
	moods: Readonly<Mood[]>,
	duration = 30
): Partial<Mood>[] => {
	if (moods.length === 0) return [];

	const lastDate = new Date();
	const firstDate = duration
		? addDays(lastDate, -duration)
		: moods[moods.length - 1].date;
	const totalDays = differenceInDays(lastDate, firstDate) + 1;

	const filledData: Partial<Mood>[] = [];
	const moodMap = new Map<string, Mood>();

	// Fill the moodMap with existing mood data
	moods.forEach((mood) => {
		const dateStr = format(mood.date, "yyyy-MM-dd");
		moodMap.set(dateStr, mood);
	});

	// Iterate over the range of dates and fill in missing data
	for (let i = 0; i < totalDays; i++) {
		const currentDate = addDays(firstDate, i);
		const dateStr = format(currentDate, "yyyy-MM-dd");

		if (moodMap.has(dateStr)) {
			filledData.push(moodMap.get(dateStr) as Partial<Mood>);
		} else {
			filledData.push({
				id: "",
				date: currentDate,
				mood: undefined,
				stress: NaN,
				energy: NaN,
				well: "",
				notWell: "",
				feel: NaN,
				activities: "",
				grateful: "",
				isNew: true,
			});
		}
	}

	return filledData;
};
