import DashboardPagesHeader from "@/components/activities/DashboardPagesHeader";
import { ActivityForm } from "@/components/activities/form/ActivityForm";
import { getData } from "@/lib/getData";
import { baseUrl } from "@/utils/baseUrl";
import { Activity } from "@prisma/client";

const page = async () => {
    const res = await getData<{ data: Activity[] }>(
        `${baseUrl}/api/activity/get-all`,
    );
    const activity = res.data;
    console.log(activity);

    return (
        <div className="max-w-4xl mx-auto">
            <DashboardPagesHeader
                title="Activities"
                link="/dashboard/activities/add"
                linkTitle="Add activity"
            />
            <ActivityForm />
        </div>
    );
};

export default page;
