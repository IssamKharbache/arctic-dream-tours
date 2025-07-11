import DashboardPagesHeader from "@/components/activities/DashboardPagesHeader";
import AddCategoryForm from "@/components/activities/form/AddCategoryForm";

const page = () => {
    return (
        <div className="max-w-2xl mx-auto">
            <DashboardPagesHeader title="Add a new category" />
            <AddCategoryForm />
        </div>
    );
};

export default page;
