import { NextResponse } from "next/server";
import { activityFormSchema } from "@/lib/schema/validations/validation";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/database/db";
import { generateSlug } from "@/utils/generateSlug";

// Extended schema with imageUrl
const apiActivitySchema = activityFormSchema.extend({
    imageUrl: z.string().url("Valid image URL is required").min(1),
    imageKey: z.string().min(1, "Image key is required").min(1),
});

export async function POST(request: Request) {
    try {
        //1. Authenticate the request
        // const session = await getServerSession(authOptions);
        // if (!session) {
        //     return NextResponse.json(
        //         { error: "Unauthorized" },
        //         { status: 401 },
        //     );
        // }
        // 2. Validate the request body with extended schema
        const body = await request.json();
        const validation = apiActivitySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid data", details: validation.error.errors },
                { status: 400 },
            );
        }

        const {
            title,
            description,
            shortDescription,
            location,
            duration,
            adultPrice,
            childPrice,
            tags,
            difficulty,
            seasonType,
            cancellationPolicy,
            included,
            bring,
            meetingPoints,
            bookingCutoffHours,
            liveTourGuide,
            imageUrl,
            imageKey,
        } = validation.data;

        const slug = generateSlug(title);
        // 3. Generate slug and check for duplicates
        const existingActivity = await db.activity.findUnique({
            where: { slug },
        });

        if (existingActivity) {
            return NextResponse.json(
                { error: "An activity with this title already exists" },
                { status: 409 },
            );
        }

        // 4. Create the activity with all required fields
        const activity = await db.activity.create({
            data: {
                title,
                slug,
                description,
                shortDescription,
                location,
                duration,
                adultPrice,
                childPrice: childPrice === 0 ? null : childPrice, // Handle 0 as null
                tags,
                difficulty,
                seasonType,
                cancellationPolicy: cancellationPolicy || null,
                included: included
                    .filter((item) => item.value.trim() !== "") // Filter out empty values
                    .map((item) => item.value),
                meetingPoints: meetingPoints
                    .filter((point) => point.value.trim() !== "") // Filter out empty values
                    .map((point) => point.value),
                bring: bring || null,
                bookingCutoffHours:
                    bookingCutoffHours === 0 ? null : bookingCutoffHours,
                liveTourGuide,
                imageUrl,
                imageKey,
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
