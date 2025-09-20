import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const blogs = await db.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({
      data: blogs,
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
