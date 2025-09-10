// app/api/booking/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookingRef = searchParams.get("bookingRef");

  if (!bookingRef) {
    return NextResponse.json(
      { error: "Booking reference required" },
      { status: 400 }
    );
  }

  const booking = await db.booking.findUnique({
    where: { bookingRef },
    include: { activity: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ booking });
}
