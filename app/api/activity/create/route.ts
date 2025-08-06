import { NextResponse } from "next/server";
import { baseActivitySchema } from "@/lib/schema/validations/validation";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/database/db";
import { generateSlug } from "@/utils/generateSlug";

// Extended schema with imageUrl
const apiActivitySchema = baseActivitySchema.extend({
    imageUrl: z.string().url("Valid image URL is required").min(1),
    imageKey: z.string().min(1, "Image key is required"),
});

export async function POST(request: Request) {
    try {
        // 1. Authenticate
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // 2. Validate
        const body = await request.json();
        const validation = apiActivitySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid data", details: validation.error.errors },
                { status: 400 },
            );
        }

        const data = validation.data;

        // 3. Check duplicates
        const slug = generateSlug(data.title);
        const existingActivity = await db.activity.findUnique({
            where: { slug },
        });
        if (existingActivity) {
            return NextResponse.json(
                { error: "Activity with this title exists" },
                { status: 409 },
            );
        }

        // 4. Create activity
        const activity = await db.activity.create({
            data: {
                title: data.title,
                slug,
                description: data.description,
                shortDescription: data.shortDescription,
                location: data.location,
                duration: data.duration,
                adultPrice: data.adultPrice,
                childPrice: data.childPrice === 0 ? null : data.childPrice,
                tags: data.tags,
                difficulty: data.difficulty,
                seasonType: data.seasonType,
                cancellationPolicy: data.cancellationPolicy || null,
                included: (data.included as Array<{ value: string }>)
                    .filter((item) => item.value.trim() !== "")
                    .map((item) => item.value),
                meetingPoints: (data.meetingPoints as Array<{ value: string }>)
                    .filter((point) => point.value.trim() !== "")
                    .map((point) => point.value),
                bring: data.bring || null,
                bookingCutoffHours:
                    data.bookingCutoffHours === 0
                        ? null
                        : data.bookingCutoffHours,
                liveTourGuide: data.liveTourGuide,
                imageUrl: data.imageUrl,
                imageKey: data.imageKey,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
            },
        });

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error("[ACTIVITY_CREATION_ERROR]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
