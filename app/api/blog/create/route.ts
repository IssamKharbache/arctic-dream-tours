import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { title, slug, content, coverImage } = await req.json();

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Check if a blog with the same slug already exists
    const existingBlog = await db.blog.findUnique({
      where: { slug },
    });

    if (existingBlog) {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 409 }
      );
    }

    // Create the new blog post
    const newBlog = await db.blog.create({
      data: {
        title,
        slug,
        content,
        coverImage: coverImage || null,
      },
    });

    return NextResponse.json(
      {
        data: newBlog,
        message: "Blog post created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("[BLOG CREATION ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
