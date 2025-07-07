import { db } from "@/lib/database/db";
import { isValidUUID } from "@/lib/user/isValidUUID";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) => {
    const { currentPassword, newPassword } = await req.json();
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
                { error: "User not found" },
                { status: 404 },
            );
        }

        // Check if current password matches
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 401 },
            );
        }

        // Validate new password length
        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "New password must be at least 6 characters long" },
                { status: 400 },
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.user.update({
            where: { id },
            data: { password: hashedPassword },
        });

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
};
