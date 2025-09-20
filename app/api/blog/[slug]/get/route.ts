import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) => {
  const slug = (await context.params).slug;
  try {
    const blog = await db.blog.findUnique({
      where: {
        slug,
      },
    });
    if (!blog) {
      return NextResponse.json({
        data: null,
        message: "there is no such blog with the slug provided",
      });
    }
    return NextResponse.json({
      data: blog,
      message: "blog data found",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error trying to get specific blog.",
        error,
      },
      { status: 500 }
    );
  }
};
