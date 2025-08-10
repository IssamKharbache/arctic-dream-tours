import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        console.log("Received booking request");

        let rawData = await req.json();
        console.log("Raw input data:", rawData);

        // Temporary test values (remove later)
        if (!rawData.customerEmail) {
            rawData.customerEmail = "test@example.com";
        }
        if (!rawData.customerPhone) {
            rawData.customerPhone = "+1234567890";
        }

        // Validate after adding defaults

        // Get activity prices
        const activity = await db.activity.findUnique({
            where: { id: rawData.activityId },
            select: { adultPrice: true, childPrice: true },
        });
        console.log("Found activity:", activity);

        if (!activity) {
            console.error("Activity not found:", rawData.activityId);
            return NextResponse.json(
                { error: "Activity not found" },
                { status: 404 },
            );
        }

        // Calculate price
        const totalPrice =
            rawData.adults * activity.adultPrice +
            rawData.children * (activity.childPrice || 0);
        console.log("Calculated total:", totalPrice);

        // Create booking
        const booking = await db.booking.create({
            data: {
                activityId: rawData.activityId,
                date: new Date(rawData.date),
                adults: rawData.adults,
                children: rawData.children,
                totalPrice,
                customerEmail: rawData.customerEmail,
                customerPhone: rawData.customerPhone,
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
