import { User as PrismaUser } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            email: string;
            role: string;
            isVerified: boolean;
            firstName: string;
            lastName: string;
        } & DefaultSession["user"];
        expires: string;
    }

    interface User extends DefaultUser {
        id: string;
        email: string;
        role: string;
        isVerified: boolean;
        firstName: string;
        lastName: string;
        remember?: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        role: string;
        isVerified: boolean;
        firstName: string;
        lastName: string;
        remember?: boolean;
        exp?: number;
    }
}
