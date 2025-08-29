import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");
    const token = searchParams.get("token");

    if (!bookingId || !token) {
      return NextResponse.json(
        { error: "Booking ID and token are required" },
        { status: 400 }
      );
    }

    const booking = await db.booking.findUnique({
      where: {
        id: bookingId,
        accessToken: token,
      },
      include: {
        activity: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found or invalid token" },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking by token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
