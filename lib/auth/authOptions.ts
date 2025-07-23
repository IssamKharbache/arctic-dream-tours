import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { db } from "@/lib/database/db";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    pages: {
        signIn: "/sign-in",
        error: "/error",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                remember: { label: "Remember me", type: "checkbox" },
            },
            async authorize(credentials) {
                const remember = credentials?.remember;
                if (authOptions.session) {
                    if (remember === "yes") {
                        authOptions.session.maxAge = 30 * 24 * 60 * 60;
                    } else {
                        authOptions.session.maxAge = 1 * 24 * 60 * 60;
                    }
                }
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Email and password are required");
                    }

                    const user = await db.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user) throw new Error("User not found");

                    const validPassword = await bcrypt.compare(
                        credentials.password,
                        user.password,
                    );
                    if (!validPassword) throw new Error("Invalid password");

                    return {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        isVerified: user.isEmailVerified,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            },
        }),
    ],
    cookies: {
        sessionToken: {
            name:
                process.env.NODE_ENV === "production"
                    ? "__Secure-next-auth.session-token"
                    : "next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role;
                token.isVerified = user.isVerified;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
            }
            return token;
        },
        async session({ session, token }) {
            const user = await db.user.findUnique({
                where: { id: token.id as string },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isEmailVerified: true,
                    firstName: true,
                    lastName: true,
                },
            });

            if (!user) return session;
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as string,
                    email: token.email as string,
                    role: token.role as string,
                    isVerified: token.isVerified as boolean,
                    firstName: token.firstName as string,
                    lastName: token.lastName as string,
                },
            };
        },
    },
    debug: process.env.NODE_ENV === "development",
};
