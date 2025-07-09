import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { ZodError } from "zod";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        let { firstName, lastName, email, password, role } = body;

        // Remove ALL whitespace (not just trimming) and enforce lowercase
        firstName = firstName.replace(/\s+/g, "").toLowerCase();
        lastName = lastName.replace(/\s+/g, "").toLowerCase();
        email = email.replace(/\s+/g, "").toLowerCase();

        // Validate names aren't empty after processing
        if (!firstName || !lastName) {
            return NextResponse.json(
                {
                    data: null,
                    message: "First name and last name cannot be empty",
                },
                { status: 400 },
            );
        }

        // Check if email already exists
        const existingUserByEmail = await db.user.findUnique({
            where: { email },
        });

        if (existingUserByEmail) {
            return NextResponse.json(
                { data: null, message: "User with this email already exists" },
                { status: 409 },
            );
        }

        // Hash the password
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

        // Remove sensitive data from response
        const { password: newUserPassword, ...user } = newUser;

        // Clean up email verification data
        await db.emailVerification.deleteMany({ where: { email } });

        return NextResponse.json(
            { data: user, message: "User created successfully" },
            { status: 201 },
        );
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: error.flatten(), message: "Validation failed" },
                { status: 400 },
            );
        }

        if (error instanceof Error) {
            console.error("User creation error:", error);
            return NextResponse.json(
                { error: error.message, message: "Error creating user" },
                { status: 500 },
            );
        }

        return NextResponse.json(
            { error: "Unknown error", message: "An unexpected error occurred" },
            { status: 500 },
        );
    }
};
