import { signOut } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async (_request: Request) => {
	try {
		await signOut();
		revalidatePath("/");
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
