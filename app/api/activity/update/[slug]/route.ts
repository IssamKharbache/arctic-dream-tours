import { NextResponse } from "next/server";
import { baseActivitySchema } from "@/lib/schema/validations/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/database/db";
import { generateSlug } from "@/utils/generateSlug";
import { z } from "zod";

// Image optional on update
const updateActivitySchema = baseActivitySchema.extend({
  imageUrl: z.string().url().optional(),
  imageKey: z.string().optional(),
});

type Params = {
  params: {
    slug: string;
  };
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    // 1. Auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;

    // 2. Parse + validate body
    const body = await request.json();
    const validation = updateActivitySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.errors },
        { status: 400 },
      );
    }

    const data = validation.data;

    // 3. Find existing activity by slug
    const existingActivity = await db.activity.findUnique({
      where: { slug },
    });

    if (!existingActivity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 },
      );
    }

    // 4. Handle slug change if title changed
    let newSlug = existingActivity.slug;

    if (data.title !== existingActivity.title) {
      const generatedSlug = generateSlug(data.title);

      const slugConflict = await db.activity.findFirst({
        where: {
          slug: generatedSlug,
          NOT: { id: existingActivity.id },
        },
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: "Another activity with this title already exists" },
          { status: 409 },
        );
      }

      newSlug = generatedSlug;
    }

    // 5. Update activity
    const updatedActivity = await db.activity.update({
      where: { slug },
      data: {
        title: data.title,
        slug: newSlug,
        description: data.description,
        shortDescription: data.shortDescription,
        location: data.location,
        duration: data.duration,
        adultPrice: data.adultPrice,
        childPrice: data.childPrice,
        privateTourPrice: data.privateTourPrice,
        tags: data.tags,
        isForChild: data.isForChild,
        difficulty: data.difficulty,
        cancellationPolicy: data.cancellationPolicy || null,
        bring: data.bring || null,

        included: (data.included as Array<{ value: string }>)
          .filter((item) => item.value.trim() !== "")
          .map((item) => item.value),

        meetingPoints: (data.meetingPoints as Array<{ value: string }>)
          .filter((point) => point.value.trim() !== "")
          .map((point) => point.value),

        departureHours: (data.departureHours as Array<{ value: string }>)
          .filter((hour) => hour.value.trim() !== "")
          .map((hour) => hour.value),

        bookingCutoffHours:
          data.bookingCutoffHours === 0 ? null : data.bookingCutoffHours,

        liveTourGuide: data.liveTourGuide,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),

        // Update image ONLY if provided
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
        ...(data.imageKey && { imageKey: data.imageKey }),
      },
    });

    return NextResponse.json(updatedActivity, { status: 200 });
  } catch (error) {
    console.error("[ACTIVITY_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
