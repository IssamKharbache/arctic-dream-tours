import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    context: {
        params: Promise<{ id: string }>;
    },
) => {
    const id = (await context.params).id;

    try {
        const userData = await db.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isEmailVerified: true,
                createdAt: true,
            },
        });
        if (!userData) {
            return NextResponse.json(
                { message: "User not found with this id" },
                { status: 404 },
            );
        }
        return NextResponse.json(
            {
                data: userData,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
};
