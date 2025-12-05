export const dynamic = "force-dynamic";

import DashboardPagesHeader from "@/components/activities/DashboardPagesHeader";
import { getData } from "@/lib/getData";
import { baseUrl } from "@/utils/baseUrl";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { User } from "@/types/prisma";

const page = async () => {
  const res = await getData<{ data: User[] }>(`${baseUrl}/api/user/get-all`);
  const users = res.data;

  return (
    <div>
      <DashboardPagesHeader title="Clients" />
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default page;
