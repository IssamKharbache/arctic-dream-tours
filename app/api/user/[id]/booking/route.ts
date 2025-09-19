import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) => {
  const id = (await context.params).id;

  try {
    const bookingData = await db.booking.findMany({
      where: {
        userId: id,
      },
      include: {
        activity: true,
      },
    });
    if (!bookingData) {
      return NextResponse.json(
        { message: "User not found with this id" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        data: bookingData,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
