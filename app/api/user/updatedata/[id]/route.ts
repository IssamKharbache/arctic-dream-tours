import { db } from "@/lib/database/db";
import { isValidUUID } from "@/lib/user/isValidUUID";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) => {
    const { firstName, lastName, email, currentPassword, newPassword } =
        await req.json();
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

        // Compare passwords
        if (currentPassword) {
            const isTheSamePassword = await bcrypt.compare(
                currentPassword,
                user.password,
            );
            if (!isTheSamePassword) {
                return NextResponse.json(
                    {
                        error: "The password provided does not match the user's current password",
                    },
                    { status: 401 },
                );
            }
        }

        // Prepare updated data
        const clean = (str: string) => str.trim().toLowerCase();
        const updatedFirstName = firstName ? clean(firstName) : user.firstName;
        const updatedLastName = lastName ? clean(lastName) : user.lastName;
        const updatedEmail = email ? clean(email) : user.email;
        const updatedPassword = newPassword
            ? await bcrypt.hash(newPassword, 10)
            : user.password;

        // Update user
        const updatedUser = await db.user.update({
            where: { id },
            data: {
                firstName: updatedFirstName,
                lastName: updatedLastName,
                email: updatedEmail,
                password: updatedPassword,
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
