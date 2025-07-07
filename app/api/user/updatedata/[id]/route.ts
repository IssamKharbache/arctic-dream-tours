import { db } from "@/lib/database/db";
import { isValidUUID } from "@/lib/user/isValidUUID";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) => {
    const { firstName, lastName, email } = await req.json();
    const id = (await context.params).id;

    try {
        // Validate UUID
        if (!isValidUUID(id)) {
            return NextResponse.json(
                { error: "Invalid ID format" },
                { status: 400 },
            );
        }

        // Find user
        const user = await db.user.findUnique({ where: { id } });
        if (!user) {
            return NextResponse.json(
                { error: "User under the provided id is not found" },
                { status: 404 },
            );
        }

        // Check if email is already in use by another user
        if (email && email.trim().toLowerCase() !== user.email) {
            const existingUser = await db.user.findUnique({
                where: { email: email.trim().toLowerCase() },
            });

            if (existingUser && existingUser.id !== id) {
                return NextResponse.json(
                    { error: "Email is already in use" },
                    { status: 409 }, // 409 Conflict
                );
            }
        }

        // Prepare updated data
        const updatedFirstName = firstName
            ? firstName.trim().toLowerCase()
            : user.firstName;
        const updatedLastName = lastName
            ? lastName.trim().toLowerCase()
            : user.lastName;
        const updatedEmail = email ? email.trim().toLowerCase() : user.email;

        // Update user
        const updatedUser = await db.user.update({
            where: { id },
            data: {
                firstName: updatedFirstName,
                lastName: updatedLastName,
                email: updatedEmail,
            },
        });

        // Remove password from response
        const { password: removed, ...userWithoutPassword } = updatedUser;

        return NextResponse.json(
            { data: userWithoutPassword },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
};
