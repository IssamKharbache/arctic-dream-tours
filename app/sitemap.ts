import { baseUrl } from "@/utils/baseUrl";
import { Blog } from "@prisma/client";
import { Activity } from "@prisma/client";

const locales = ["en", "fr", "it", "zh", "ja", "de", "ar", "es"];

export default async function sitemap() {
  // Fetch blogs
  const blogRes = await fetch(`${baseUrl}/api/blog/get-all`);
  const blogData = await blogRes.json();
  const blogs: Blog[] = blogData?.data || [];

  // Fetch activities
  const activityRes = await fetch(`${baseUrl}/api/activity/get-all`);
  const activityData = await activityRes.json();
  const activities: Activity[] = activityData?.data || [];

  // Generate URLs per locale
  const blogUrls = blogs.flatMap((blog) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || blog.createdAt,
    }))
  );

  const activityUrls = activities.flatMap((activity) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/activities/${activity.slug}`,
      lastModified: activity.updatedAt || activity.createdAt,
    }))
  );

  const homeUrls = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
  }));

  return [...homeUrls, ...blogUrls, ...activityUrls];
}
