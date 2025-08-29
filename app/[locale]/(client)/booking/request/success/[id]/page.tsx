import SuccessBookingRequest from "@/components/activities/booking/SuccessBookingRequest";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const boookingId = (await params).id;

  return <SuccessBookingRequest bookingId={boookingId} />;
};

export default page;
