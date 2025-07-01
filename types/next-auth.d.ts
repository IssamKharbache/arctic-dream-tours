import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            isVerified: boolean;
            firstName: string;
            lastName: string;
            email: string;
        };
    }

    interface User extends DefaultUser {
        id: string;
        role: string;
        isVerified: boolean;
        firstName: string;
        lastName: string;
        email: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        role: string;
        isVerified: boolean;
        firstName: string;
        lastName: string;
        email: string;
    }
}
