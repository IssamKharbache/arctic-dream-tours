import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/navigation";

interface BlogData {
  content: string;
  coverImage: string | null;
  createdAt: Date;
  id: string;
  slug: string;
  title: string;
  updatedAt: Date;
}

interface BlogCarouselProps {
  blogs: BlogData[];
  title?: string;
}

export function BlogCarousel({
  blogs,
  title = "More Stories",
}: BlogCarouselProps) {
  return (
    <section className="py-16 border-t border-border">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground">
            Discover more amazing stories and adventures
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4 relative">
            {blogs.map((blog) => (
              <CarouselItem
                key={blog.id}
                className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <BlogCard blog={blog} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>
          <div className="block md:hidden">
            <div className="absolute top-7 right-14">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
}

function BlogCard({ blog }: { blog: BlogData }) {
  const publishedDate = new Date(blog.createdAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  // Extract first paragraph from content for preview
  const getPreview = (content: string) => {
    const textContent = content.replace(/<[^>]*>/g, "");
    return textContent.length > 150
      ? textContent.substring(0, 150) + "..."
      : textContent;
  };

  return (
    <Link href={`/blog/${blog.slug}` as any} className="group block">
      <article className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:border-primary/50 h-full">
        {/* Cover Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={blog.coverImage || "/placeholder.svg"}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {blog.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {getPreview(blog.content)}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <time
              className="text-xs text-muted-foreground"
              dateTime={blog.createdAt.toString()}
            >
              {publishedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
