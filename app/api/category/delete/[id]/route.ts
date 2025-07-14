import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) => {
    const id = (await context.params).id;

    try {
        const category = await db.category.findUnique({
            where: {
                id,
            },
        });
        if (!category) {
            return NextResponse.json(
                {
                    error: "NO category were found under the provided id",
                },
                {
                    status: 404,
                },
            );
        }
        await db.category.delete({
            where: {
                id,
            },
        });
        return NextResponse.json(
            {
                message: "Category deleted successfully",
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
