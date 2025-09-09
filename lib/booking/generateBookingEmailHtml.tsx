import { BookingConfirmationEmail } from "@/components/email/BookingConfirmation";
import { render } from "@react-email/render";

export const generateBookingEmailHtml = async (bookingData: {
  bookingRef: string;
  customerName: string;
  activityName: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  totalPrice: number;
  pickUpLocation: string;
  dropOffLocation: string;
  isPrivate: boolean;
  status: string;
}) => {
  const html = render(
    <BookingConfirmationEmail
      bookingRef={bookingData.bookingRef}
      customerName={bookingData.customerName}
      activityName={bookingData.activityName}
      date={bookingData.date}
      time={bookingData.time}
      adults={bookingData.adults}
      numChildren={bookingData.children}
      totalPrice={bookingData.totalPrice}
      pickUpLocation={bookingData.pickUpLocation}
      dropOffLocation={bookingData.dropOffLocation}
      isPrivate={bookingData.isPrivate}
      status={bookingData.status}
    />,
    {
      pretty: true,
    }
  );

  return html;
};
