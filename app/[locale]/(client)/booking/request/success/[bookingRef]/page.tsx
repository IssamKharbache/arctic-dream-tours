import SuccessBookingRequest from "@/components/activities/booking/SuccessBookingRequest";
import React from "react";

interface PageProps {
  params: Promise<{ bookingRef: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { bookingRef } = await params;
  return <SuccessBookingRequest bookingRef={bookingRef} />;
};

export default Page;
