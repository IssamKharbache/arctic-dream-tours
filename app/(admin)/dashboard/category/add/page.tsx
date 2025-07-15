import DashboardPagesHeader from "@/components/activities/DashboardPagesHeader";
import { CategoryForm } from "@/components/activities/form/CategoryForm";

const page = () => {
    return (
        <div className="max-w-2xl mx-auto">
            <DashboardPagesHeader title="Add a new category" />
            <CategoryForm />
        </div>
    );
};

export default page;
