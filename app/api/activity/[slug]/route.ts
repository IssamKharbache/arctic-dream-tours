import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    context: { params: Promise<{ slug: string }> },
) => {
    const slug = (await context.params).slug;
    try {
        const activity = await db.activity.findUnique({
            where: {
                slug,
            },
        });
        if (!activity) {
            return NextResponse.json({
                data: null,
                message: "there is no such activity with the slug provided",
            });
        }
        return NextResponse.json({
            data: activity,
            message: "activity data found",
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                message:
                    "Erreur pendant la retrer de produit, veuillez essayer apres.",
                error,
            },
            { status: 500 },
        );
    }
};
