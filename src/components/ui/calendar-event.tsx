"use client";

import React, { useEffect, useRef, useState } from "react";
import {
	format,
	startOfWeek,
	addDays,
	startOfMonth,
	endOfMonth,
	endOfWeek,
	isSameMonth,
	isSameDay,
	subMonths,
	addMonths,
	isAfter,
} from "date-fns";
import { type Mood } from "@prisma/client";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CalendarHeader = ({
	activeDate,
	setActiveDate,
}: {
	activeDate: Date;
	setActiveDate: (date: Date) => void;
}) => {
	return (
		<div className="flex items-center justify-center gap-4">
			<Button
				onClick={() => setActiveDate(subMonths(activeDate, 1))}
				variant={"ghost"}
			>
				<AiOutlineLeft />
			</Button>
			<h2 className="currentMonth">{format(activeDate, "MMMM yyyy")}</h2>
			<Button
				onClick={() => setActiveDate(addMonths(activeDate, 1))}
				variant={"ghost"}
			>
				<AiOutlineRight />
			</Button>
		</div>
	);
};

const WeekDaysLabels = ({ activeDate }: { activeDate: Date }) => {
	const weekStartDate = startOfWeek(activeDate);
	return (
		<div className="grid grid-cols-7">
			{new Array(7).fill(0).map((_, i) => {
				return (
					<div className="text-base text-center" key={`WeekDaysNames-${i}`}>
						{format(addDays(weekStartDate, i), "E")}
					</div>
				);
			})}
		</div>
	);
};

export type Options<T> = {
	label: string;
	onClick?: (props: T) => void;
	path?: (props: T) => string;
};

type WeekProps = {
	startDate: Date;
	selectedDate: Date;
	activeDate: Date;
	setSelectedDate: (date: Date) => void;
	events: Omit<Mood, "userId">[];
	options?: Options<Omit<Mood, "userId">>[];
};

const Week: React.FC<WeekProps> = ({
	startDate,
	selectedDate,
	activeDate,
	setSelectedDate,
	events,
	options = [],
}) => {
	return new Array(7).fill(0).map((_, i) => {
		const currentDate = addDays(startDate, i);
		const cloneDate = new Date(currentDate);
		const dayEvents = events.filter((event) =>
			isSameDay(event.date, currentDate)
		);

		return (
			<ContextMenu key={`${currentDate}-${i}-${Math.random()}`}>
				<ContextMenuTrigger asChild>
					<button
						className={cn(
							"w-auto h-20 md:h-[5.5rem] flex flex-col p-1 md:p-2 cursor-default",
							isSameMonth(currentDate, activeDate) ? "" : "inactiveDay",
							isSameDay(currentDate, selectedDate) ? "bg-accent/75" : "",
							isAfter(currentDate, addDays(new Date(), 0)) ? "bg-accent" : ""
						)}
						onClick={() => {
							setSelectedDate(cloneDate);
						}}
						disabled={isAfter(currentDate, addDays(new Date(), 0))}
					>
						<div className={cn("flex justify-end w-full")}>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<p
										className={cn(
											"md:hidden flex",
											"w-full md:w-auto justify-center items-center px-2 ",
											isSameDay(currentDate, new Date())
												? "bg-primary rounded text-primary-foreground "
												: ""
										)}
									>
										{format(currentDate, "d")}
									</p>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									{dayEvents.length !== 0 &&
										options.map((option, index) => {
											return option.path ? (
												<>
													<Link
														href={
															dayEvents[0] && option.path
																? option.path(dayEvents[0])
																: "#"
														}
														passHref
														legacyBehavior
														prefetch={false}
													>
														<DropdownMenuItem
															key={`ContextMenuItem-${currentDate}-${index}`}
														>
															{option.label}
														</DropdownMenuItem>
													</Link>
												</>
											) : option.onClick ? (
												<>
													<DropdownMenuItem
														key={`ContextMenuItem-${currentDate}-${index}`}
														onClick={() =>
															option.onClick && option.onClick(dayEvents[0])
														}
													>
														{option.label}
													</DropdownMenuItem>
												</>
											) : null;
										})}
									{dayEvents.length === 0 && (
										<>
											<Link
												href={`/dashboard/mood/create?date=${new Date(
													currentDate.setHours(12)
												).toISOString()}`}
												passHref
												legacyBehavior
												prefetch={false}
											>
												<DropdownMenuItem
													key={`ContextMenuItem-${currentDate}-create`}
												>
													Create
												</DropdownMenuItem>
											</Link>
										</>
									)}
								</DropdownMenuContent>
							</DropdownMenu>

							<p
								className={cn(
									"hidden md:flex",
									"w-full md:w-auto justify-center items-center px-2 ",
									isSameDay(currentDate, new Date())
										? "bg-primary rounded text-primary-foreground "
										: ""
								)}
							>
								{format(currentDate, "d")}
							</p>
						</div>

						{dayEvents.map((event, i) => (
							<>
								<div
									key={`${currentDate.getDate().toLocaleString()}-mood-1-${i}`}
									className="sm:hidden flex h-full w-full justify-center items-center"
								>
									<span className="w-2 h-2 bg-primary rounded-full" />
								</div>
								<div
									key={`${currentDate.getDate().toLocaleString()}-mood-2-${i}`}
									className="hidden sm:flex justify-start items-start flex-col w-full h-full mt-1 rounded text-primary px-1 text-xs"
								>
									{`You are ${event.mood}`}
								</div>
							</>
						))}
					</button>
				</ContextMenuTrigger>
				<ContextMenuContent>
					{dayEvents.length !== 0 &&
						options.map((option, index) => {
							return option.path ? (
								<>
									<Link
										href={
											dayEvents[0] && option.path
												? option.path(dayEvents[0])
												: "#"
										}
										passHref
										legacyBehavior
										prefetch={false}
									>
										<ContextMenuItem
											key={`ContextMenuItem-${currentDate}-${index}`}
										>
											{option.label}
										</ContextMenuItem>
									</Link>
								</>
							) : option.onClick ? (
								<>
									<ContextMenuItem
										key={`ContextMenuItem-${currentDate}-${index}`}
										onClick={() =>
											option.onClick && option.onClick(dayEvents[0])
										}
									>
										{option.label}
									</ContextMenuItem>
								</>
							) : null;
						})}
					{dayEvents.length === 0 && (
						<>
							<Link
								href={`/dashboard/mood/create?date=${new Date(
									currentDate.setHours(12)
								).toISOString()}`}
								passHref
								legacyBehavior
								prefetch={false}
							>
								<ContextMenuItem key={`ContextMenuItem-${currentDate}-create`}>
									Create
								</ContextMenuItem>
							</Link>
						</>
					)}
				</ContextMenuContent>
			</ContextMenu>
		);
	});
};

type MonthProps = {
	activeDate: Date;
	selectedDate: Date;
	setSelectedDate: (date: Date) => void;
	events: Omit<Mood, "userId">[];
	options?: Options<Omit<Mood, "userId">>[];
};

const Month: React.FC<MonthProps> = ({
	activeDate,
	selectedDate,
	setSelectedDate,
	events,
	options,
}) => {
	const getDates = () => {
		const startOfTheSelectedMonth = startOfMonth(activeDate);
		const endOfTheSelectedMonth = endOfMonth(activeDate);
		const startDate = startOfWeek(startOfTheSelectedMonth);
		const endDate = endOfWeek(endOfTheSelectedMonth);

		let currentDate = startDate;

		const allWeeks = [];

		while (currentDate <= endDate) {
			allWeeks.push(
				<Week
					key={currentDate.toDateString()}
					startDate={currentDate}
					selectedDate={selectedDate}
					activeDate={activeDate}
					setSelectedDate={setSelectedDate}
					events={events}
					options={options}
				/>
			);
			currentDate = addDays(currentDate, 7);
		}

		return <div className="grid grid-cols-7">{allWeeks}</div>;
	};

	return getDates();
};

type CalendarProps = {
	events?: Omit<Mood, "userId">[];
	options?: Options<Omit<Mood, "userId">>[];
	onSelectDate?: (date: Date) => void;
};

const Calendar = ({ events = [], options, onSelectDate }: CalendarProps) => {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [activeDate, setActiveDate] = useState(new Date());

	useEffect(() => {
		onSelectDate ? onSelectDate(selectedDate) : null;
	}, [selectedDate, onSelectDate]);

	return (
		<section className=" border">
			<CalendarHeader activeDate={activeDate} setActiveDate={setActiveDate} />
			<WeekDaysLabels activeDate={activeDate} />
			<Month
				activeDate={activeDate}
				events={events}
				selectedDate={selectedDate}
				setSelectedDate={setSelectedDate}
				options={options}
			/>
		</section>
	);
};

export default Calendar;
