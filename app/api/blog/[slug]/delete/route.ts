import { db } from "@/lib/database/db";
import { uatpi } from "@/utils/uploadthingUATpi";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
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
      return NextResponse.json(
        {
          error: "NO blog were found under the provided slug",
        },
        {
          status: 404,
        }
      );
    }
    await db.blog.delete({
      where: {
        slug,
      },
    });

    return NextResponse.json(
      {
        message: "blog deleted successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    NextResponse.json(
      { error: error, message: "Internal server error" },
      { status: 500 }
    );
  }
};
