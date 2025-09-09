import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, ClockIcon } from "lucide-react";
import { Activity } from "@/types/activity";
import { Link } from "@/i18n/navigation";
import { LiquidDifficultyIndicator } from "./LiquidDifficultyIndicator";

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-primary/10 hover:bg-primary/20  hover:-rotate-1 hover:-translate-y-1 transition-transform duration-300 ease-in-out">
      <div className="relative h-48 w-full">
        <Link href={`/activity/${activity.slug}` as any}>
          <Image
            src={
              activity.imageUrl ||
              `/placeholder.svg?height=200&width=400&query=${activity.seasonType === "WINTER" ? "winter activity in Finland snow" : "summer activity in Finland nature"}`
            }
            alt={activity.title}
            fill
            className="object-cover rounded-2xl "
          />
        </Link>
      </div>
      <div className="flex text-gray-500 items-center justify-center gap-5 font-normal py-5 text-sm">
        <div className="flex items-center gap-2">
          <ClockIcon size={20} />
          <p>{activity.duration}</p>
        </div>
        <div className="flex items-center gap-2">
          <LiquidDifficultyIndicator difficulty={activity.difficulty} />
          <p>{formatActivityDifficulty(activity.difficulty)}</p>
        </div>
      </div>
      <Link href={`/activity/${activity.slug}` as any} className="p-5">
        <p className="text-2xl text-center font-bold capitalize">
          {activity.title}
        </p>
      </Link>
      <div className="p-2">
        <p className="text-md text-center font-normal capitalize text-slate-500">
          {activity.shortDescription}
        </p>
      </div>
      <div className="flex gap-5 items-center text-slate-400 mt-5">
        {activity.location && (
          <div className="flex items-center gap-1 ">
            <MapPin className="h-4 w-4" />
            <span className="capitalize">{activity.location}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between pt-4">
        <div className="flex flex-col">
          {activity.adultPrice && (
            <span className="text-2xl font-bold text-primary">
              €{activity.adultPrice}
            </span>
          )}
          <span className="text-xs text-muted-foreground">per person</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href={`/activity/${activity.slug}` as any}>
            <Button className="ml-auto rounded-full hover:scale-105">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function formatActivityDifficulty(value: string): string {
  switch (value) {
    case "EASY":
      return "Easy";
    case "MODERATE":
      return "Moderate";
    case "HARD":
      return "Hard";
    case "EXTREME":
      return "Extreme";
    default:
      return "Unknown";
  }
}
