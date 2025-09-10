import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ bookingRef: string }> }
) => {
  const ref = (await context.params).bookingRef;

  if (!ref) {
    return NextResponse.json(
      { error: "Booking reference required" },
      { status: 400 }
    );
  }

  const booking = await db.booking.findUnique({
    where: { bookingRef: ref },
    include: { activity: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ booking });
};
