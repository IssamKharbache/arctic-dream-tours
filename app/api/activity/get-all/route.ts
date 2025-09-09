import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const activityData = await db.activity.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({
      data: activityData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: "An unexpected error occurred",
      },
      {
        status: 500,
      }
    );
  }
};
