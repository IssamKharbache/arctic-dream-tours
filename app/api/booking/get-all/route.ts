import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const bookingsData = await db.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        activity: true,
      },
    });
    return NextResponse.json({
      data: bookingsData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unknown error",
        message: "An unexpected error occurred",
      },
      {
        status: 500,
      }
    );
  }
};
