"use client";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";

export function ActivitiesHero() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 bg-primary ">
      <div className="container mx-auto px-4 mt-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Discover Finland's
            <span className="text-primary block">Amazing Activities</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Experience the best of Finnish nature through our carefully curated
            outdoor adventures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Badge
              variant="secondary"
              className="flex items-center gap-2 px-4 py-2"
            >
              <MapPin className="h-4 w-4" />
              Based in Finland
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-2 px-4 py-2"
            >
              <Calendar className="h-4 w-4" />
              Year-round Adventures
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
