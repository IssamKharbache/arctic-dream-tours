import { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";
import { UserRole } from "@prisma/client"; // Adjust based on your actual role type

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: UserRole;
            isVerified: boolean;
            firstName: string;
            lastName: string;
            email: string;
        };
    }

    interface User extends DefaultUser {
        id: string;
        role: UserRole;
        isVerified: boolean;
        firstName: string;
        lastName: string;
        email: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        role: UserRole;
        isVerified: boolean;
        firstName: string;
        lastName: string;
        email: string;
    }
}
