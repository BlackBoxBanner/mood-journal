import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const session = await getSession();
	const email = session.email;

	const isStartWith = (...paths: string[]) => {
		return paths.some((path) => request.nextUrl.pathname.startsWith(path));
	};

	if (isStartWith("/dashboard") && !email) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	if (isStartWith("/auth") && email) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: [
		"/auth/:path*",
		"/dashboard/:path*",
		{
			source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},

		{
			source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
			has: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},

		{
			source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
			has: [{ type: "header", key: "x-present" }],
			missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
		},
	],
};
