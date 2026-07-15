import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const activityData = await db.activity.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    activityData.sort((a, b) => {
      const aIsNorthern = a.title.toLowerCase().includes("northern light");
      const bIsNorthern = b.title.toLowerCase().includes("northern light");

      if (aIsNorthern === bIsNorthern) return 0;

      return aIsNorthern ? -1 : 1;
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
      },
    );
  }
};
