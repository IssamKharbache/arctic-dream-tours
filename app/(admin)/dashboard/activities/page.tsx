export const dynamic = "force-dynamic";

import DashboardPagesHeader from "@/components/activities/DashboardPagesHeader";
import { getData } from "@/lib/getData";
import { baseUrl } from "@/utils/baseUrl";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Activity } from "@/types/activity";

const page = async () => {
  const res = await getData<{ data: Activity[] }>(
    `${baseUrl}/api/activity/get-all`
  );
  const activities = res.data;

  return (
    <div>
      <DashboardPagesHeader
        title="Activities"
        link="/dashboard/activities/add"
        linkTitle="Add activity"
      />
      <DataTable columns={columns} data={activities} />
    </div>
  );
};

export default page;
