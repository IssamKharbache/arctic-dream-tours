import { baseUrl } from "@/utils/baseUrl";
import { stripe } from "@/utils/stripe";
import { generateAccessToken } from "@/utils/tokens";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { bookingData } = await request.json();
    console.log(bookingData);

    if (!bookingData) {
      return NextResponse.json({ error: "Booking not found" }, { status: 400 });
    }

    // Generate access token for this booking
    const accessToken = generateAccessToken();

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price_data: {
            unit_amount: bookingData.totalPrice * 100,
            currency: "eur",
            product_data: {
              name: bookingData.email,
              images: [bookingData.email],
            },
          },
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        activityId: bookingData.activityId,
        date: bookingData.date!, // ISO string
        adults: bookingData.adults?.toString() || "1",
        children: bookingData.children?.toString() || "0",
        infants: bookingData.infants?.toString() || "0",
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        email: bookingData.email,
        phone: bookingData.phone,
        pickUpLocation: bookingData.pickUpLocation,
        dropOffLocation: bookingData.dropOffLocation,
        isPrivateTour: bookingData.isPrivateTour ? "true" : "false",
        bookingRef: bookingData.bookingRef,
        departureHour: bookingData.departureHour,
        totalPrice: bookingData.totalPrice!.toString(),
      },
      automatic_tax: { enabled: true },
      success_url: `${baseUrl}/en/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Payment session creation failed" },
      { status: 500 }
    );
  }
};
