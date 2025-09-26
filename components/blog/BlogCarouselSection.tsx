"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Blog } from "@prisma/client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface BlogCarouselSectionProps {
  blogs: Blog[];
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").substring(0, 120) + "...";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogCarouselSection({ blogs }: BlogCarouselSectionProps) {
  const t = useTranslations("blog");
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t("description")}
          </p>
        </div>

        {/* Blog Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {blogs.map((blog) => (
                <CarouselItem
                  key={blog.id}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="group h-full bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <CardContent className="p-0">
                      {/* Blog Image */}
                      <div className="relative h-48 overflow-hidden ">
                        <Image
                          src={blog.coverImage || "/placeholder.svg"}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-100 "
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* Blog Content */}
                      <div className="p-6">
                        {/* Date */}
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(blog.createdAt.toString())}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {blog.title}
                        </h3>

                        {/* Content Preview */}
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                          {stripHtml(blog.content)}
                        </p>
                        {blog.keywords && blog.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {blog.keywords.map((keyword) => (
                              <span
                                key={keyword}
                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Read More Link */}
                        <Link href={`/blog/${blog.slug}` as any}>
                          <Button
                            variant="ghost"
                            className="py-3 h-auto text-primary hover:bg-primary hover:text-white group/btn hover:cursor-pointer  mt-8"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-card border-border hover:bg-accent" />
            <CarouselNext className="hidden md:flex -right-12 bg-card border-border hover:bg-accent" />
          </Carousel>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/blogs">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              View All Blogs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
