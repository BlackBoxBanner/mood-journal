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
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const EnergyAndStressLevelChart = ({
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
				label: "stress",
				data: moods.map((v) => v.stress),
				tension: 0.5,
			},
			{
				label: "energy",
				data: moods.map((v) => v.energy),
				tension: 0.5,
			},
		],
	};
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Energy and Stress Level</CardTitle>
					<CardDescription>{`This plot visualizes the relationship between energy levels and stress levels recorded over a period.`}</CardDescription>
				</CardHeader>
				<CardContent className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-4">
					<div className="relative">
						<LineChart
							data={stressLevelBarChart}
							options={{
								scales: {
									y: {
										beginAtZero: true,
										max: 10,
										min: 0,
										ticks: {
											stepSize: 1,
										},
									},
									x: {
										type: "category",
										max: 30,
									},
								},
								responsive: true,
								plugins: {
									// zoom: {
									// 	pan: {
									// 		enabled: true,
									// 		mode: "x",
									// 	},
									// 	zoom: {
									// 		pinch: {
									// 			enabled: true, // Enable pinch zooming
									// 		},
									// 		wheel: {
									// 			enabled: true, // Enable wheel zooming
									// 		},
									// 		mode: "x",
									// 	},
									// },
								},
							}}
						/>
					</div>
					<div className="max-h-[12rem] md:max-h-[16rem] lg:max-h-[24rem] overflow-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Day</TableHead>
									<TableHead>Energy</TableHead>
									<TableHead>Stress</TableHead>
									<TableHead className="text-right">Mood</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{moods.map((mood) => {
									return (
										<TableRow key={mood.id}>
											<TableCell>
												{format(mood.date ? mood.date : new Date(), "d MMM")}
											</TableCell>
											<TableCell>{mood.energy}</TableCell>
											<TableCell>{mood.stress}</TableCell>
											<TableCell className="text-right">{mood.mood}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default EnergyAndStressLevelChart;
