import { baseUrl } from "@/utils/baseUrl";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/blog",
          "/en/blog",
          "/fr/blog",
          "/it/blog",
          "/zh/blog",
          "/ja/blog",
          "/de/blog",
          "/ar/blog",
          "/es/blog",
        ],
        disallow: ["/dashboard"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
