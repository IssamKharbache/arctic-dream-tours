import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    email: string;
    id: string;
  }
  interface Session {
    user: User & {
      email: string;
      id: string;
    };
    token: {
      email: string;
      id: string;
    };
  }
}
