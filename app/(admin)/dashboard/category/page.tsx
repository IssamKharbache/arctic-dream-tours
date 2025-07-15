import DashboardPagesHeader from "@/components/activities/DashboardPagesHeader";
import { getData } from "@/lib/getData";
import { baseUrl } from "@/utils/baseUrl";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Category } from "@prisma/client";
import { CategoryEditDialog } from "@/components/activities/form/dialogs/CategoryEditDialog";

type SimpleCategory = {
    id: string;
    name: string;
    description?: string;
    slug: string;
};
const page = async () => {
    const res = await getData<{ data: Category[] }>(
        `${baseUrl}/api/category/get-all`,
    );
    const categories = res.data;
    return (
        <div className="max-w-4xl mx-auto">
            <DashboardPagesHeader
                title="Categories"
                link="/dashboard/category/add"
                linkTitle="Add Category"
            />
            <DataTable columns={columns} data={categories} />

            <CategoryEditDialog categories={categories} />
        </div>
    );
};

export default page;
