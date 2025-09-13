export const dynamic = "force-dynamic";

import DashboardPagesHeader from "@/components/activities/DashboardPagesHeader";
import { getData } from "@/lib/getData";
import { baseUrl } from "@/utils/baseUrl";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { BookingWithActivity } from "@/types/activityWithBooking";

const page = async () => {
  const res = await getData<{ data: BookingWithActivity[] }>(
    `${baseUrl}/api/booking/get-all`
  );
  const bookings = res.data;

  return (
    <div>
      <DashboardPagesHeader title="Bookings" />
      <DataTable columns={columns} data={bookings} />
    </div>
  );
};

export default page;
