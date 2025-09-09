import SuccessBookingRequest from "@/components/activities/booking/SuccessBookingRequest";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  return <SuccessBookingRequest bookingId={id} />;
};

export default Page;
