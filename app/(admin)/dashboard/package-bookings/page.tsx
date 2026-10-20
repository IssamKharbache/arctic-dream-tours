export const dynamic = "force-dynamic";

import DashboardPagesHeader from "@/components/activities/DashboardPagesHeader";
import { getData } from "@/lib/getData";
import { PackageBookingWithActivities } from "@/types/packageBookingWithAct";
import { baseUrl } from "@/utils/baseUrl";
import PackageBookingsTable from "./data-table";

const Page = async () => {
    const res = await getData<{
        data: PackageBookingWithActivities[];
    }>(`${baseUrl}/api/package-booking/get-all`);

    return (
        <div>
            <DashboardPagesHeader title="Package Bookings" />
            <PackageBookingsTable initialData={res.data} />
        </div>
    );
};

export default Page;