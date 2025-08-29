import { sendBookingEmail } from "@/lib/auth/sendBookingEmail";
import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: { status: "PAID" },
    });
    // Send confirmation email
    try {
      await sendBookingEmail({
        bookingRef: updatedBooking.bookingRef,
        customerName: `${updatedBooking.firstName} ${updatedBooking.lastName}`,
        customerEmail: updatedBooking.email,
        activityName: "TEst name",
        date: new Date(updatedBooking.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: updatedBooking.departureHour,
        adults: updatedBooking.adults,
        children: updatedBooking.children,
        totalPrice: updatedBooking.totalPrice,
        pickUpLocation: updatedBooking.pickUpLocation,
        dropOffLocation: updatedBooking.dropOffLocation,
        isPrivate: updatedBooking.isPrivate,
        status: updatedBooking.status,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
};
