import SuccessBookingRequest from "@/components/activities/booking/SuccessBookingRequest";
import React from "react";

const Page = async ({ params }: { params: { id: string } }) => {
  const bookingId = params.id; // just access directly

  return <SuccessBookingRequest bookingId={bookingId} />;
};

export default Page;
