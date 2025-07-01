import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { NextAuthOptions } from "next-auth";
import { db } from "../database/db";

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
            },
            async authorize(credentials) {
                const email = credentials?.email;
                const password = credentials?.password;

                if (!email || !password) {
                    return null;
                }

                const user = await db.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    return null;
                }

                const validPassword = await bcrypt.compare(
                    password,
                    user.password,
                );
                if (!validPassword) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isEmailVerified,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
            },
        }),
    ],
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
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    email: token.email,
                    role: token.role,
                    isVerified: token.isVerified,
                    firstName: token.firstName,
                    lastName: token.lastName,
                },
            };
        },
    },
};
