import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { ZodError } from "zod";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { firstName, lastName, email, password, role } = body;

        //check if email already exists
        const existingUserByEmail = await db.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUserByEmail) {
            return NextResponse.json(
                {
                    data: null,
                    message: "User with this email already exists",
                },
                {
                    status: 409,
                },
            );
        }

        //hashing the password
        const hashedPassword = await hash(password, 10);
        const newUser = await db.user.create({
            data: {
                email,
                firstName,
                lastName,
                role,
                password: hashedPassword,
                isEmailVerified: true,
            },
        });

        const { password: newUserPassword, ...user } = newUser;
        //deleting the email verification data after the sign up
        await db.emailVerification.deleteMany({
            where: { email },
        });

        return NextResponse.json(
            {
                data: user,
                message: "User created successfully",
            },
            {
                status: 201,
            },
        );
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: error.flatten(),
                    message: "Validation failed",
                },
                {
                    status: 400,
                },
            );
        }

        if (error instanceof Error) {
            return NextResponse.json(
                {
                    error: error.message,
                    message:
                        "Something went wrong while trying to create a user",
                },
                {
                    status: 500,
                },
            );
        }

        return NextResponse.json(
            {
                error: "Unknown error occurred",
                message: "Something went wrong while trying to create a user",
            },
            {
                status: 500,
            },
        );
    }
};
