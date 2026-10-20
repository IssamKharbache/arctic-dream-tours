import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const bookingsData = await db.packageBooking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        activities: {
          include: {
            activity: true,
          },
        },
      },
    });

    return NextResponse.json({ data: bookingsData });
  } catch (error) {
    console.error("Error fetching package bookings:", error);

    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
};