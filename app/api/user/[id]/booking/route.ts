
import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  },
) => {
  const { id } = await context.params;

  try {
    const [bookings, packageBookings] = await Promise.all([
      db.booking.findMany({
        where: {
          userId: id,
        },
        include: {
          activity: true,
        },
        orderBy: {
          date: "desc",
        },
      }),

      db.packageBooking.findMany({
        where: {
          userId: id,
        },
        include: {
          activities: {
            include: {
              activity: true,
            },
            orderBy: {
              date: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return NextResponse.json(
      {
        data: bookings,
        packageBookings,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching user bookings:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
