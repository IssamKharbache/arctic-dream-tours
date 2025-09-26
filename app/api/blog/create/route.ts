import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { title, slug, content, coverImage, keywords } = await req.json();

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    const existingBlog = await db.blog.findUnique({ where: { slug } });
    if (existingBlog) {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 409 }
      );
    }

    const newBlog = await db.blog.create({
      data: {
        title,
        slug,
        content,
        coverImage: coverImage || null,
        keywords: keywords || [],
      },
    });

    return NextResponse.json(
      {
        data: newBlog,
        message: "Blog post created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[BLOG CREATION ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
