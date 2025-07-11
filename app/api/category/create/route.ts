import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { name, description, slug } = body;

        const formattedName = name.trim();
        // Check if a category with the same slug already exists
        const existing = await db.category.findUnique({
            where: { slug },
        });

        if (existing) {
            return NextResponse.json(
                {
                    message: "Category with this name already exists",
                    data: null,
                },
                { status: 409 },
            );
        }

        const newCategory = await db.category.create({
            data: {
                name: formattedName,
                slug,
                description,
            },
        });

        return NextResponse.json(
            { data: newCategory, message: "Category created successfully" },
            { status: 201 },
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: error.flatten(), message: "Validation failed" },
                { status: 400 },
            );
        }

        if (error instanceof Error) {
            console.error("Category creation error:", error);
            return NextResponse.json(
                { error: error.message, message: "Error creating category" },
                { status: 500 },
            );
        }

        return NextResponse.json(
            { error: "Unknown error", message: "An unexpected error occurred" },
            { status: 500 },
        );
    }
};
