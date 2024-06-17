"use client";

import { format } from "date-fns";
import { Mood } from "@prisma/client";
import LineChart from "@/components/chart/line";
import { LineChartProps } from "@/components/chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const MoodOverTimeChart = ({
	moods,
}: {
	moods: Partial<Omit<Mood, "userId">>[];
}) => {
	const stressLevelBarChart: LineChartProps = {
		labels: moods.map((mood) => {
			return format(mood.date ? mood.date : new Date(), "d/M");
		}),
		datasets: [
			{
				label: "mood",
				data: moods.map((v) => v.mood),
				tension: 0.5,
			},
		],
	};
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Mood over time</CardTitle>
					<CardDescription>{`Shows the trend of mood (e.g., happy, sad) across recorded dates, indicating mood fluctuations over time.`}</CardDescription>
				</CardHeader>
				<CardContent className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-4">
					<div className="relative">
						<LineChart
							data={stressLevelBarChart}
							options={{
								scales: {
									y: {
										type: "category",
										labels: [
											"very-happy",
											"happy",
											"normal",
											"sad",
											"very-sad",
										],
									},
								},
							}}
						/>
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default MoodOverTimeChart;
