import { signUp } from "@/lib/auth";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
	const body = await request.text();

	try {
		await signUp(body);
		return NextResponse.json({ message: "Success" });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ message: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
