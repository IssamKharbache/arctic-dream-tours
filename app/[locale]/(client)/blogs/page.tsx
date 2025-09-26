import { BlogListing } from "@/components/blog/BlogListing";
import { baseUrl } from "@/utils/baseUrl";
import { Blog } from "@prisma/client";
import React from "react";

export const metadata = {
  title: "Blogs",
  description:
    "Explore our latest stories, insights, and adventures from Arctic Dream Tours.",
};

const page = async () => {
  // Fetch activities on the server
  const res = await fetch(`${baseUrl}/api/blog/get-all`);
  const data = await res.json();
  const blogs: Blog[] = data?.data || [];

  return <BlogListing blogs={blogs} />;
};

export default page;
