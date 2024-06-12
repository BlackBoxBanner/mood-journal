import { decrypt } from "@/lib/crypto";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createUser, getUniqueUser } from "@/lib/prisma/query/user";

export type Session = {
	email: string;
};

const authSecret = process.env.AUTH_SECRET;

if (!authSecret) {
	throw new Error("AUTH_SECRET is not set");
}

export const getSession = async () => {
	return getIronSession<Session>(cookies(), {
		password: authSecret,
		cookieName: "mood-auth-status",
	});
};

const SignInSchema = z.object({
	email: z
		.string({
			required_error: "Email is required",
			message: "Invalid email",
			invalid_type_error: "Email is required",
		})
		.email("Invalid email"),
	password: z
		.string({
			required_error: "Password is required",
			message: "Password must be at least 8 characters",
			invalid_type_error: "Password is required",
		})
		.min(8),
});

export const signIn = async (data: string) => {
	"use server";
	const session = await getSession();

	const decryptData = await decrypt(data);

	const { email, password } = await SignInSchema.parseAsync(decryptData);

	const user = await getUniqueUser({
		where: {
			email,
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	const passwordMatch = await bcrypt.compare(password, user.password);

	if (!passwordMatch) {
		throw new Error("Invalid password");
	}

	session.email = email;
	return session.save();
};

export const signOut = async () => {
	const session = await getSession();
	session.destroy();
};

const SignUpSchema = z.object({
	email: z
		.string({
			required_error: "Email is required",
			message: "Invalid email",
			invalid_type_error: "Email is required",
		})
		.email("Invalid email"),
	password: z
		.string({
			required_error: "Password is required",
			message: "Password must be at least 8 characters",
			invalid_type_error: "Password is required",
		})
		.min(8),
	confirmPassword: z
		.string({
			required_error: "Password is required",
			message: "Password must be at least 8 characters",
			invalid_type_error: "Password is required",
		})
		.min(8),
});

export const signUp = async (data: string) => {
	"use server";
	const session = await getSession();

	const decryptData = await decrypt(data);

	const { email, password, confirmPassword } = await SignUpSchema.parseAsync(
		decryptData
	);

	if (password !== confirmPassword) {
		throw new Error("Passwords do not match");
	}

	const user = await getUniqueUser({
		where: {
			email,
		},
	});

	if (user) {
		throw new Error("User already exists");
	}
	const salt = bcrypt.genSaltSync(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	await createUser({
		data: {
			email,
			password: hashedPassword,
		},
	});

	session.email = email;

	return session.save();
};
