import DashboardPagesHeader from "@/components/activities/DashboardPagesHeader";
const page = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <DashboardPagesHeader
                title="Categories"
                link="/dashboard/category/add"
                linkTitle="Add Category"
            />
            <div>Category data here</div>
        </div>
    );
};

export default page;
