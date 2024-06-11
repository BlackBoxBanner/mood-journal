"use client";

import {Options} from "@/components/ui/calendar-event";
import {Mood} from "@prisma/client";

export const calendarOptions: Options<Omit<Mood, "userId">>[] = [
	{
		label: "View",
    path: (e)=> `/dashboard/mood/${e.id}`
	},
	{
		label: "Edit",
		path: (e)=> `/dashboard/mood/${e.id}/edit`
	},
	{
		label: "Delete",
		onClick: (props) => console.log(props),
	},
];