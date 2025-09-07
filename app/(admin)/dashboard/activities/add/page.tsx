import DashboardPagesHeader from "@/components/activities/DashboardPagesHeader";
import { ActivityForm } from "@/components/activities/form/ActivityForm";

const page = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <DashboardPagesHeader title="Add a new activity" />
      <ActivityForm />
    </div>
  );
};

export default page;
