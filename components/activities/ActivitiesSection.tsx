"use client";

import { Badge } from "@/components/ui/badge";
import { ActivityCard } from "@/components/activities/ActivityCard";
import type { Activity } from "@/types/activity";

interface ActivitiesSectionProps {
  title: string;
  description: string;
  color: string;
  activities: Activity[];
}

export function ActivitiesSection({
  title,
  description,
  activities,
}: ActivitiesSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        </div>
        <Badge variant="secondary">
          {activities.length}{" "}
          {activities.length === 1 ? "Activity" : "Activities"}{" "}
          {/* Can translate */}
        </Badge>
      </div>
      <p className="text-muted-foreground mb-8 text-lg">{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </section>
  );
}
