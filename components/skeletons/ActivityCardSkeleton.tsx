import { Skeleton } from "@/components/ui/skeleton";

export function ActivityCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-primary/10">
      {/* Image */}
      <Skeleton className="h-48 w-full rounded-2xl" />

      {/* Duration + Difficulty */}
      <div className="flex items-center justify-center gap-5 py-5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Title */}
      <Skeleton className="h-6 w-3/4 mx-auto" />

      {/* Short Description */}
      <div className="p-2">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </div>

      {/* Location */}
      <div className="flex gap-5 items-center mt-5">
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Price + Button */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <Skeleton className="h-6 w-16 mb-1" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
    </div>
  );
}
