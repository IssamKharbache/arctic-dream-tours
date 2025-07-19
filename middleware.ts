import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
    const response = intlMiddleware(request);
    const pathname = request.nextUrl.pathname;
    const locale = request.nextUrl.locale || "en";
    // Only check for /dashboard
    if (pathname.startsWith("/dashboard")) {
        const token = await getToken({ req: request });

        if (!token) {
            // Create redirect response
            const redirectUrl = new URL("/", request.url);
            redirectUrl.searchParams.set("showAuthModal", "true");

            // Set cookie that client can read
            const response = NextResponse.redirect(redirectUrl);
            response.cookies.set({
                name: "show-auth-modal",
                value: "true",
                path: "/",
                maxAge: 30, // 30 seconds
                httpOnly: false, // Must be false to be readable by client
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
            });

            return response;
        }

        if (token.role !== "ADMIN") {
            return NextResponse.redirect(
                new URL(`/${locale}/unauthorized`, request.url),
            );
        }
    }

    return response;
}

export const config = {
    matcher: ["/dashboard/:path*", "/", "/(en|fr|de|es|it|ja|zh|ar|ch)/:path*"],
};
