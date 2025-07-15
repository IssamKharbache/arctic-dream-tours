import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) => {
    const { name, description } = await req.json();
    const id = (await context.params).id;

    if (!name || !description) {
        return NextResponse.json({
            error: "You must provide at least one changed value to update",
        });
    }

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
        await db.category.update({
            where: {
                id,
            },
            data: {
                name,
                description,
            },
        });
        return NextResponse.json(
            {
                message: "Category updated successfully",
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
