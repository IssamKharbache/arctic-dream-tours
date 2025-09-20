import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

interface BlogData {
  content: string;
  coverImage: string | null;
  createdAt: Date;
  id: string;
  slug: string;
  title: string;
  updatedAt: Date;
}

interface BlogPostProps {
  blog: BlogData;
}

export function BlogPost({ blog }: BlogPostProps) {
  const publishedDate = new Date(blog.createdAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  return (
    <article className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-6 mt-20">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <time dateTime={blog.createdAt.toString()}>
              {publishedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>•</span>
            <span>{timeAgo}</span>
            <span>•</span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
          <Image
            src={blog.coverImage || "/placeholder.svg"}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* Content */}
      <div
        className={`prose prose-lg prose-invert max-w-none ${inter.className} text-base md:text-xl`}
      >
        <div
          className="text-foreground leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </article>
  );
}
