import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";

// Setup next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const locale = request.nextUrl.locale || "en";

    if (pathname.startsWith("/dashboard")) {
        const token = await getToken({ req: request });

        if (!token) {
            const redirectUrl = new URL("/", request.url);
            redirectUrl.searchParams.set("showAuthModal", "true");

            const response = NextResponse.redirect(redirectUrl);
            response.cookies.set({
                name: "show-auth-modal",
                value: "true",
                path: "/",
                maxAge: 30,
                httpOnly: false,
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

        return NextResponse.next();
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: [
        "/", // homepage
        "/(en|fr|de|es|it|ja|zh|ar|ch)/:path*",
        "/dashboard/:path*",
    ],
};
