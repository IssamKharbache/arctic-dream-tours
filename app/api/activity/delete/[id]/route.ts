import { db } from "@/lib/database/db";
import { uatpi } from "@/utils/uploadthingUATpi";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) => {
    const id = (await context.params).id;

    try {
        const activity = await db.activity.findUnique({
            where: {
                id,
            },
        });
        if (!activity) {
            return NextResponse.json(
                {
                    error: "NO activity were found under the provided id",
                },
                {
                    status: 404,
                },
            );
        }
        await db.activity.delete({
            where: {
                id,
            },
        });
        if (activity.imageKey) {
            await uatpi.deleteFiles(activity.imageKey);
        }
        return NextResponse.json(
            {
                message: "activity deleted successfully",
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
