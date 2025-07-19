import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const usersData = await db.user.findMany({
            where: {
                role: "USER",
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json({
            data: usersData,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Unknown error",
                message: "An unexpected error occurred",
            },
            {
                status: 500,
            },
        );
    }
};
