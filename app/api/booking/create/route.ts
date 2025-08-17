import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";
import {
    bookingSchema,
    customerDetailsSchema,
} from "@/lib/schema/validations/validation";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();

        // Validate booking info
        const bookingValidation = bookingSchema.safeParse(body);
        if (!bookingValidation.success) {
            return NextResponse.json(
                {
                    message: "Booking validation failed",
                    errors: bookingValidation.error.flatten(),
                },
                { status: 400 },
            );
        }
        const bookingData = bookingValidation.data;

        // Validate customer info
        const customerValidation = customerDetailsSchema.safeParse(body);
        if (!customerValidation.success) {
            return NextResponse.json(
                {
                    message: "Customer validation failed",
                    errors: customerValidation.error.flatten(),
                },
                { status: 400 },
            );
        }
        const customerData = customerValidation.data;

        // Compute total price if you have activity price
        // Optionally, you can fetch activity price from db.activity
        const activity = await db.activity.findUnique({
            where: { id: bookingData.activityId },
        });
        if (!activity) {
            return NextResponse.json(
                { message: "Activity not found" },
                { status: 404 },
            );
        }

        const totalPrice =
            (activity.adultPrice || 0) * bookingData.adults +
            (activity.childPrice || 0) * bookingData.children;

        const newBooking = await db.booking.create({
            data: {
                activityId: bookingData.activityId,
                date: new Date(bookingData.date),
                adults: bookingData.adults,
                children: bookingData.children,
                totalPrice,
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                email: customerData.email,
                phone: customerData.phone,
                bookingRef: bookingData.bookingRef,
            },
        });

        return NextResponse.json(
            { message: "Booking created successfully", data: newBooking },
            { status: 201 },
        );
    } catch (error) {
        console.error("Booking creation error:", error);
        return NextResponse.json(
            {
                message: "Error creating booking",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
};
