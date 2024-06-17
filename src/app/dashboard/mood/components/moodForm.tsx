"use client";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import MultiValueInput from "@/components/ui/multiple-input";
import MultiValueSelection from "@/components/ui/multiple-select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { binaryToFeels, feels } from "@/lib/feel";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, isAfter, isValid } from "date-fns";
import { createMoodAction, editMoodAction } from "./mood-action";
import { encrypt } from "@/lib/crypto";
import { useRouter, useSearchParams } from "next/navigation";
import { type Mood } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const moodFormSchema = z.object({
	mood: z.string().min(1, "Please select a mood"),
	stress: z
		.number()
		.int("Please select a stress level")
		.min(1, "Please select a stress level")
		.refine((v) => v >= 1 && v <= 10, {
			message: "Stress level should be between 1 and 10",
		}),
	energy: z
		.number()
		.int("Please select an energy level")
		.min(1, "Please select a stress level")
		.refine((v) => v >= 1 && v <= 10, {
			message: "Energy level should be between 1 and 10",
		}),
	well: z.string().min(1, "Please add at least one thing you are well"),
	notWell: z.string(),
	feel: z.array(z.string()).min(1, "Please add at least one feeling"),
	activities: z.array(z.string()).min(1, "Please add at least one activity"),
	grateful: z
		.string()
		.min(1, "Please add at least one thing you are grateful for"),
	date: z.date({
		message: "Please select a date",
	}),
});

type MoodFormValues = z.infer<typeof moodFormSchema>;

type MoodFormProps = Partial<Mood> & {
	userId: string;
	callbackPath?: string;
	method?: "create" | "edit";
	id?: string;
};

const MoodForm = ({
	callbackPath = "/dashboard/mood",
	userId,
	method = "create",
	id,
	...mood
}: MoodFormProps) => {
	const searchParams = useSearchParams();
	const date = searchParams.get("date");

	const getCurrentDate = () => {
		if (mood.date) return mood.date;
		if (date) {
			// const splitDate = date?.split("-").map(v => parseInt(v))
			const formatDate = new Date(date);

			return isValid(formatDate)
				? isAfter(formatDate, new Date())
					? new Date()
					: formatDate
				: new Date();
		}
		return new Date();
	};

	const router = useRouter();

	const form = useForm<MoodFormValues>({
		resolver: zodResolver(moodFormSchema),
		defaultValues: {
			mood: mood.mood,
			stress: mood.stress,
			energy: mood.energy,
			well: mood.well,
			notWell: mood.notWell,
			feel: mood.feel ? binaryToFeels(mood.feel) : [],
			activities: mood.activities?.split(" "),
			grateful: mood.grateful,
			date: new Date(format(getCurrentDate().setHours(12), "Pp")),
		},
	});

	const { toast } = useToast();

	async function onSubmit(values: MoodFormValues) {
		try {
			console.log(format(getCurrentDate().setHours(12), "Pp"));
			if (method === "create") {
				await createMoodAction(await encrypt({ ...values, userId }));
				router.push("/dashboard/mood");
			}

			if (method === "edit") {
				await editMoodAction(await encrypt({ ...values, userId, id }));
				router.push("/dashboard/mood");
			}
		} catch (e) {
			if (e instanceof Error) {
				return toast({
					title: "Error",
					description: e.message,
					variant: "destructive",
				});
			}
			return toast({
				title: "Error",
				description: "There are some error while execute this action.",
				variant: "destructive",
			});
		}
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="w-full grid lg:grid-cols-4 gap-4 gap-y-6">
						<FormField
							control={form.control}
							name="date"
							render={({ field: { ...field } }) => (
								<FormItem className="mb-8 space-y-2 flex flex-col">
									<FormLabel>{`What is a date today?`}</FormLabel>
									<FormControl>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant={"outline"}
													className={cn(
														"w-full pl-3 text-left font-normal",
														!field.value && "text-muted-foreground"
													)}
													disabled={method === "edit"}
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) => {
														return date > new Date();
													}}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<section className="grid lg:grid-cols-4 gap-4 gap-y-6">
						{/* NOTE - mood */}
						<FormField
							control={form.control}
							name="mood"
							render={({ field: { ...field } }) => (
								<FormItem className="col-span-4 lg:col-span-1">
									<FormLabel>{`How are you feeling today?`}</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger className="">
												<SelectValue placeholder="Mood" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="very-sad">Very sad</SelectItem>
												<SelectItem value="sad">Sad</SelectItem>
												<SelectItem value="normal">Normal</SelectItem>
												<SelectItem value="happy">Happy</SelectItem>
												<SelectItem value="very-happy">Very happy</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* NOTE - activities */}
						<FormField
							control={form.control}
							name="activities"
							render={({ field: { ...field } }) => {
								return (
									<FormItem className="col-span-4 lg:col-span-1">
										<FormLabel>{`What activities did you do today?`}</FormLabel>
										<FormControl>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<MultiValueInput
															defaultValue={field.value}
															repeatable={false}
															onChanges={field.onChange}
															placeholder="Activity"
														/>
													</TooltipTrigger>
													<TooltipContent>
														<p>
															Press enter/tap/space-bar to regis the activity.
														</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						{/* NOTE - energy */}
						<FormField
							control={form.control}
							name="energy"
							render={({ field: { onChange, ...field } }) => {
								return (
									<FormItem className="col-span-2 lg:col-span-1">
										<FormLabel>{`Energy level`}</FormLabel>
										<FormControl>
											<Input
												{...field}
												onChange={(e) => onChange(parseInt(e.target.value))}
												type="number"
												min={1}
												max={10}
												inputMode={"numeric"}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						{/* NOTE - stress */}
						<FormField
							control={form.control}
							name="stress"
							render={({ field: { onChange, ...field } }) => {
								return (
									<FormItem className="col-span-2 lg:col-span-1">
										<FormLabel>{`Stress level`}</FormLabel>
										<FormControl>
											<Input
												{...field}
												onChange={(e) => onChange(parseInt(e.target.value))}
												type="number"
												min={1}
												max={10}
												inputMode={"numeric"}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						{/* NOTE - feel */}
						<FormField
							control={form.control}
							name="feel"
							render={({ field: { ...field } }) => {
								return (
									<FormItem className="col-span-4">
										<FormLabel>{`What did you feel today?`}</FormLabel>
										<FormControl>
											<MultiValueSelection
												defaultValue={field.value}
												onChanges={field.onChange}
												option={feels}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						{/* NOTE - grateful */}
						<FormField
							control={form.control}
							name="grateful"
							render={({ field: { ...field } }) => {
								return (
									<FormItem className="col-span-4 lg:col-span-2">
										<FormLabel>{`Today, I'm grateful for`}</FormLabel>
										<FormControl>
											<div className="relative">
												<Textarea
													{...field}
													placeholder="I'm grateful for ..."
													maxLength={300}
												/>
												<span className="absolute bottom-2 right-2 text-sm ">{`${
													field.value?.length ? field.value.length : 0
												} / 300`}</span>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						{/* NOTE - well */}
						<FormField
							control={form.control}
							name="well"
							render={({ field: { ...field } }) => {
								return (
									<FormItem className="col-span-4 lg:col-span-2">
										<FormLabel>{`What went well?`}</FormLabel>
										<FormControl>
											<div className="relative">
												<Textarea
													{...field}
													placeholder="Something went well ..."
													maxLength={300}
												/>
												<span className="absolute bottom-2 right-2 text-sm ">{`${
													field.value?.length ? field.value.length : 0
												} / 300`}</span>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						{/* NOTE - notWell */}
						<FormField
							control={form.control}
							name="notWell"
							render={({ field: { ...field } }) => {
								return (
									<FormItem className="col-span-4 lg:col-span-2">
										<FormLabel>{`What didn't work`}</FormLabel>
										<FormControl>
											<div className="relative">
												<Textarea
													{...field}
													placeholder="Something didn't work ..."
													maxLength={300}
												/>
												<span className="absolute bottom-2 right-2 text-sm ">{`${
													field.value?.length ? field.value.length : 0
												} / 300`}</span>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
					</section>
					<Button type="submit" className="mt-8">
						{method === "create" ? "Create" : "Save"}
					</Button>
				</form>
			</Form>
		</>
	);
};

export default MoodForm;
