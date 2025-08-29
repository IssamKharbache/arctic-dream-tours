import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";
import {
  bookingSchema,
  customerDetailsSchema,
} from "@/lib/schema/validations/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { generateAccessToken } from "@/utils/tokens";
import { sendBookingEmail } from "@/lib/auth/sendBookingEmail";

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const accessToken = generateAccessToken();

    // Extract booking fields
    const bookingValidation = bookingSchema.safeParse({
      activityId: body.activityId,
      date: body.date,
      adults: body.adults,
      infants: body.infants,
      children: body.children,
      bookingRef: body.bookingRef,
      departureHour: body.departureHour,
      isPrivate: body.isPrivate,
    });
    if (!bookingValidation.success) {
      return NextResponse.json(
        {
          message: "Booking validation failed",
          errors: bookingValidation.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Extract customer fields
    const customerValidation = customerDetailsSchema.safeParse({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      pickUpLocation: body.pickUpLocation,
      dropOffLocation: body.dropOffLocation,
    });
    if (!customerValidation.success) {
      return NextResponse.json(
        {
          message: "Customer validation failed",
          errors: customerValidation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const bookingData = bookingValidation.data;
    const customerData = customerValidation.data;

    const activity = await db.activity.findUnique({
      where: { id: bookingData.activityId },
    });
    if (!activity) {
      return NextResponse.json(
        { message: "Activity not found" },
        { status: 404 }
      );
    }

    const totalPrice = bookingData.isPrivate
      ? activity.privateTourPrice || 0
      : (activity.adultPrice || 0) * bookingData.adults +
        (activity.childPrice || 0) * bookingData.children;

    const newBooking = await db.booking.create({
      data: {
        ...bookingData,
        ...customerData,
        accessToken,
        date: new Date(bookingData.date),
        totalPrice,
        userId: session?.user?.id,
        status: "PENDING", // Ensure status is set
      },
      include: {
        activity: true, // Include activity details for email
      },
    });

    // Send booking confirmation email
    try {
      await sendBookingEmail({
        bookingRef: newBooking.bookingRef,
        customerName: `${newBooking.firstName} ${newBooking.lastName}`,
        customerEmail: newBooking.email,
        activityName: activity.title,
        date: new Date(newBooking.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: newBooking.departureHour,
        adults: newBooking.adults,
        children: newBooking.children,
        totalPrice: newBooking.totalPrice,
        pickUpLocation: newBooking.pickUpLocation,
        dropOffLocation: newBooking.dropOffLocation,
        isPrivate: newBooking.isPrivate,
        status: newBooking.status,
      });
    } catch (emailError) {
      console.error("Failed to send booking email:", emailError);
      // Don't fail the booking creation if email fails
    }

    return NextResponse.json(
      { message: "Booking created successfully", data: newBooking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      {
        message: "Error creating booking",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
