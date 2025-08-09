// app/api/bookings/route.ts
import { db } from "@/lib/database/db";
import { bookingSchema } from "@/lib/schema/validations/validation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        console.log("Received booking request"); // Log start

        const rawData = await req.json();
        console.log("Raw input data:", rawData); // Log input

        // Validate input
        const validation = bookingSchema.safeParse(rawData);
        if (!validation.success) {
            console.error("Validation failed:", validation.error);
            return NextResponse.json(
                { error: validation.error },
                { status: 400 },
            );
        }

        // Get activity prices
        const activity = await db.activity.findUnique({
            where: { id: validation.data.activityId },
            select: { adultPrice: true, childPrice: true },
        });
        console.log("Found activity:", activity); // Log activity data

        if (!activity) {
            console.error("Activity not found:", validation.data.activityId);
            return NextResponse.json(
                { error: "Activity not found" },
                { status: 404 },
            );
        }

        // Calculate price
        const totalPrice =
            validation.data.adults * activity.adultPrice +
            validation.data.children * (activity.childPrice || 0);
        console.log("Calculated total:", totalPrice);

        // Create booking
        const booking = await db.booking.create({
            data: {
                activityId: validation.data.activityId,
                date: new Date(validation.data.date),
                adults: validation.data.adults,
                children: validation.data.children,
                totalPrice,
                customerEmail: validation.data.customerEmail,
                customerPhone: validation.data.customerPhone || null,
            },
        });
        console.log("Created booking:", booking);

        return NextResponse.json(
            {
                ...booking,
                date: booking.date.toISOString(),
                createdAt: booking.createdAt.toISOString(),
            },
            { status: 201 },
        );
    } catch (error) {
        // Add detailed error logging
        console.error("Full error:", error);
        console.error(
            "Error stack:",
            error instanceof Error ? error.stack : "No stack",
        );

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
