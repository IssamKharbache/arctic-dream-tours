import DashboardPagesHeader from "@/components/activities/DashboardPagesHeader";
import React from "react";
import { BlogsTable } from "./data-table";
import { getData } from "@/lib/getData";
import { Blog } from "@prisma/client";
import { baseUrl } from "@/utils/baseUrl";

const page = async () => {
  const res = await getData<{ data: Blog[] }>(`${baseUrl}/api/blog/get-all`);
  const blogs = res.data;

  return (
    <div>
      <DashboardPagesHeader
        title="Blogs"
        link="/dashboard/blogs/add"
        linkTitle="Add Blog"
      />
      <BlogsTable blogs={blogs} />
    </div>
  );
};

export default page;
