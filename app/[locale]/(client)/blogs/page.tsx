import { baseUrl } from "@/utils/baseUrl";
import { Blog } from "@prisma/client";
import React from "react";

const page = async () => {
  // Fetch activities on the server
  const res = await fetch(`${baseUrl}/api/blog/get-all`);
  const data = await res.json();
  const blogs: Blog[] = data?.data || [];

  return <div>page</div>;
};

export default page;
