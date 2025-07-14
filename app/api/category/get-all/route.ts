import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const categoryData = await db.category.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json({
            data: categoryData,
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
