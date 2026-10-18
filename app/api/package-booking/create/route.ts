import { randomUUID } from "node:crypto";
import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";
import { customerDetailsSchema } from "@/lib/schema/validations/validation";

const PACKAGE_RULES = {
  classic: { name: "Lapland Classic", pickCount: 4 },
  dream: { name: "Lapland Dream", pickCount: 6 },
  ultimate: { name: "Full Lapland Experience", pickCount: 7 },
} as const;

type PackageId = keyof typeof PACKAGE_RULES;

type Selection = {
  activityId: string;
  date: Date;
  dateKey: string;
  departureHour: string | null;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class BookingError extends Error {}

const fail = (message: string, errors?: unknown) =>
  NextResponse.json(errors ? { message, errors } : { message }, {
    status: 400,
  });

const isCount = (value: unknown, min: number): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= min;

const round2 = (value: number) => Math.round(value * 100) / 100;

const monthDay = (date: Date) => date.getUTCMonth() * 100 + date.getUTCDate();

function isInSeason(
  activity: { startDate: Date; endDate: Date },
  date: Date,
) {
  const start = monthDay(activity.startDate);
  const end = monthDay(activity.endDate);
  const current = monthDay(date);
  return start <= end
    ? current >= start && current <= end
    : current >= start || current <= end;
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return fail("Invalid request body");
    }

    const data = body as Record<string, unknown>;

    if (
      typeof data.packageId !== "string" ||
      !Object.hasOwn(PACKAGE_RULES, data.packageId)
    ) {
      return fail("Invalid package");
    }

    const packageId = data.packageId as PackageId;
    const packageRule = PACKAGE_RULES[packageId];

    if (!data.members || typeof data.members !== "object") {
      return fail("Invalid member selection");
    }

    const { adults, children, infants } = data.members as Record<
      string,
      unknown
    >;

    if (!isCount(adults, 1) || !isCount(children, 0) || !isCount(infants, 0)) {
      return fail("Invalid member counts");
    }

    const customerResult = customerDetailsSchema.safeParse(data.customer);

    if (!customerResult.success) {
      return fail("Customer validation failed", customerResult.error.flatten());
    }

    const customer = customerResult.data;

    if (
      !Array.isArray(data.activities) ||
      data.activities.length !== packageRule.pickCount
    ) {
      return fail(
        `This package requires exactly ${packageRule.pickCount} activities`,
      );
    }

    const selections: Selection[] = [];

    for (const item of data.activities as unknown[]) {
      if (!item || typeof item !== "object") {
        return fail("Invalid activity selection");
      }

      const {
        activityId,
        date: dateKey,
        departureHour,
      } = item as Record<string, unknown>;

      if (
        typeof activityId !== "string" ||
        !UUID_PATTERN.test(activityId) ||
        typeof dateKey !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)
      ) {
        return fail("Each activity requires a valid ID and date");
      }

      const date = new Date(`${dateKey}T00:00:00.000Z`);

      if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== dateKey
      ) {
        return fail("Invalid activity date");
      }

      if (
        departureHour !== undefined &&
        departureHour !== null &&
        typeof departureHour !== "string"
      ) {
        return fail("Invalid departure hour");
      }

      selections.push({
        activityId,
        date,
        dateKey,
        departureHour: departureHour || null,
      });
    }

    const activityIds = selections.map((item) => item.activityId);

    if (new Set(activityIds).size !== activityIds.length) {
      return fail("An activity cannot be selected more than once");
    }

    if (new Set(selections.map((item) => item.dateKey)).size !== selections.length) {
      return fail("Each activity must be on a different day");
    }

    const booking = await db.$transaction(async (tx) => {
      const activities = await tx.activity.findMany({
        where: { id: { in: activityIds } },
      });

      const activitiesById = new Map(
        activities.map((activity) => [activity.id, activity]),
      );

      const records = selections.map((selection) => {
        const activity = activitiesById.get(selection.activityId);

        if (!activity) {
          throw new BookingError("One or more selected activities were not found");
        }

        const earliest = new Date(
          Date.now() + (activity.bookingCutoffHours ?? 0) * 3_600_000,
        );
        earliest.setUTCHours(0, 0, 0, 0);

        if (selection.date < earliest || !isInSeason(activity, selection.date)) {
          throw new BookingError(
            `${activity.title} is not available on ${selection.dateKey}`,
          );
        }

        if (children > 0 && !activity.isForChild) {
          throw new BookingError(`${activity.title} does not accept children`);
        }

        const hours = activity.departureHours;

        if (
          hours.length > 0 &&
          (!selection.departureHour || !hours.includes(selection.departureHour))
        ) {
          throw new BookingError(
            `Please choose a valid departure time for ${activity.title}`,
          );
        }

        return {
  activity: {
    connect: { id: activity.id },
  },
  date: selection.date,
  departureHour:
    hours.length > 0 ? selection.departureHour! : "Not required",
  isBonus: false,
  activityTitle: activity.title,
  adultPrice: activity.adultPrice,
  childPrice: activity.childPrice,
  totalPrice: round2(
    activity.adultPrice * adults +
      (activity.childPrice ?? 0) * children,
  ),
};
      });

      const totalPrice = round2(
        records.reduce((sum, record) => sum + record.totalPrice, 0),
      );

      const bookingRef = `PKG-${randomUUID()
        .replace(/-/g, "")
        .slice(0, 12)
        .toUpperCase()}`;

      return tx.packageBooking.create({
        data: {
          packageId,
          packageName: packageRule.name,
          bookingRef,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          pickUpLocation: customer.pickUpLocation,
          dropOffLocation: customer.dropOffLocation,
          adults,
          children,
          infants,
          totalPrice,
          status: "PENDING",
          activities: { create: records },
        },
        include: { activities: true },
      });
    });

    return NextResponse.json(
      {
        message: "Package booking created successfully",
        data: {
          id: booking.id,
          bookingRef: booking.bookingRef,
          totalPrice: booking.totalPrice,
          status: booking.status,
          publicToken: booking.publicToken,
          activities: booking.activities,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof BookingError) {
      return fail(error.message);
    }

    console.error("Package booking creation error:", error);

    return NextResponse.json(
      { message: "Error creating package booking" },
      { status: 500 },
    );
  }
}