import type { Blog } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface BlogListingProps {
  blogs: Blog[];
}

export function BlogListing({ blogs }: BlogListingProps) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  const createExcerpt = (content: string, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16 ">
          <div className="max-w-3xl mt-24">
            <h1 className="text-4xl md:text-5xl text-foreground mb-6 text-balance ">
              Stories & Adventures
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              Discover exciting activities and experiences around Lapland. Read
              about Northern Lights tours, husky sledding, reindeer safaris, and
              unforgettable Arctic adventures.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-12 md:gap-16">
          {blogs.map((blog, index) => (
            <article key={blog.id} className="group cursor-pointer">
              <Link href={`/blog/${blog.slug}` as any}>
                <div className="grid md:grid-cols-12 gap-8 items-start">
                  {/* Date Column */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(blog.createdAt)}
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="md:col-span-8 space-y-4">
                    {/* Cover Image */}
                    {blog.coverImage && (
                      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
                        <Image
                          src={blog.coverImage}
                          alt={blog.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}

                    <div>
                      <h2 className="text-2xl md:text-3xl font-light text-foreground group-hover:text-primary transition-colors duration-200 text-balance capitalize">
                        {blog.title}
                      </h2>
                    </div>

                    {/* Rich Text Content */}
                    <div
                      className="text-lg text-muted-foreground leading-relaxed font-light"
                      dangerouslySetInnerHTML={{
                        __html: createExcerpt(blog.content),
                      }}
                    />

                    <div className="flex items-center gap-4 pt-2">
                      {blog.keywords && blog.keywords.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {blog.keywords.slice(0, 3).map((keyword, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="font-normal"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {getReadingTime(blog.content)}
                      </div>
                    </div>
                  </div>

                  {/* Arrow Column */}
                  <div className="md:col-span-2 flex justify-end">
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200" />
                  </div>
                </div>
              </Link>

              {/* Divider */}
              {index < blogs.length - 1 && (
                <div className="mt-12 md:mt-16 border-b border-border" />
              )}
            </article>
          ))}
        </div>

        {/* Empty State */}
        {blogs.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-light text-foreground mb-2">
                No posts yet
              </h3>
              <p className="text-muted-foreground">
                Check back soon for new content and insights.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
