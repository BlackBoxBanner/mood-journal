"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { wait } from "@/lib/utils";
import { encrypt } from "@/lib/crypto";
import { useRouter } from "next/navigation";

const SigninFormSchema = z.object({
	email: z
		.string({
			required_error: "Email is required",
			message: "Please enter a valid email address",
			invalid_type_error: "Email is required",
		})
		.email("Please enter a valid email address")
		.min(1, "Please enter your email address"),
	password: z
		.string({
			required_error: "Password is required",
			message: "Password must be at least 8 characters",
			invalid_type_error: "Password is required",
		})
		.min(8, "Password must be at least 8 characters"),
});

type SigninFormValues = z.infer<typeof SigninFormSchema>;

const SigninForm = () => {
	const { toast } = useToast();
	const router = useRouter();
	const [progress, setProgress] = useState(false);

	const form = useForm<SigninFormValues>({
		resolver: zodResolver(SigninFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: SigninFormValues) => {
		setProgress(true);

		try {
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				body: await encrypt(values),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message);
			}

			toast({
				title: "Signin",
				description: "You have successfully signed in! Redirecting...",
			});

			await wait(1000);
			router.push("/dashboard");
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An error occurred while signing in";
			form.setError("email", {
				type: "manual",
				message,
			});
			toast({
				title: "Signin",
				description: message,
				variant: "destructive",
			});
		} finally {
			await wait(1000);
			setProgress(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
			>
				<FormField
					control={form.control}
					name="email"
					render={() => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" {...form.register("email")} />
							</FormControl>
							<FormMessage>{form.formState.errors.email?.message}</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={() => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" {...form.register("password")} />
							</FormControl>
							<FormMessage>
								{form.formState.errors.password?.message}
							</FormMessage>
						</FormItem>
					)}
				/>
				<Button disabled={progress} type="submit" className="w-full mt-4">
					Signin
				</Button>
			</form>
		</Form>
	);
};

export default SigninForm;
