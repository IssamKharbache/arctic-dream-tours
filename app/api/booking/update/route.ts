import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: { status: "PAID" },
    });

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
};
