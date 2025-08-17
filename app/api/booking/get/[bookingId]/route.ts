import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";

export const GET = async (
    req: Request,
    context: { params: Promise<{ bookingId: string }> },
) => {
    const bookingId = (await context.params).bookingId;
    try {
        const booking = await db.booking.findUnique({
            where: { id: bookingId },
            include: { activity: true },
        });

        if (!booking) {
            return NextResponse.json(
                { message: "Booking not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ booking }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Error fetching booking" },
            { status: 500 },
        );
    }
};
