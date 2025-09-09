import SuccessBookingRequest from "@/components/activities/booking/SuccessBookingRequest";
import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
  const bookingId = params.id;

  return <SuccessBookingRequest bookingId={bookingId} />;
};

export default Page;
