import { BlogCarousel } from "@/components/blog/BlogCarousel";
import { BlogPost } from "@/components/blog/BlogPost";
import { getData } from "@/lib/getData";
import { baseUrl } from "@/utils/baseUrl";
import { Blog } from "@prisma/client";
import React from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}
const page = async ({ params }: PageProps) => {
  const response = await getData<{ data: Blog[] }>(
    `${baseUrl}/api/blog/get-all`
  );
  const blogs = response.data;

  const { slug } = await params;
  const res = await getData<{ data: Blog }>(`${baseUrl}/api/blog/${slug}/get`);
  const blog = res.data;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <BlogPost blog={blog} />
        <BlogCarousel blogs={blogs} />
      </main>
    </div>
  );
};

export default page;
