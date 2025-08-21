import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";
import {
    bookingSchema,
    customerDetailsSchema,
} from "@/lib/schema/validations/validation";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();

        // Extract booking fields
        const bookingValidation = bookingSchema.safeParse({
            activityId: body.activityId,
            date: body.date,
            adults: body.adults,
            children: body.children,
            bookingRef: body.bookingRef,
            departureHour: body.departureHour,
            isPrivate: body.isPrivate,
        });
        if (!bookingValidation.success) {
            return NextResponse.json(
                {
                    message: "Booking validation failed",
                    errors: bookingValidation.error.flatten(),
                },
                { status: 400 },
            );
        }

        // Extract customer fields
        const customerValidation = customerDetailsSchema.safeParse({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phone: body.phone,
            pickUpLocation: body.pickUpLocation,
            dropOffLocation: body.dropOffLocation,
        });
        if (!customerValidation.success) {
            return NextResponse.json(
                {
                    message: "Customer validation failed",
                    errors: customerValidation.error.flatten(),
                },
                { status: 400 },
            );
        }

        const bookingData = bookingValidation.data;
        const customerData = customerValidation.data;

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
                ...bookingData,
                ...customerData,
                date: new Date(bookingData.date),
                totalPrice,
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
