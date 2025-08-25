import { Activity } from "@/types/activity";
import { ActivityCard } from "./ActivityCard";

interface ActivitiesSectionProps {
    title: string;
    activities: Activity[];
    description?: string;
}

export function ActivitiesSection({
    title,
    activities,
    description,
}: ActivitiesSectionProps) {
    if (activities.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {description}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-6">
                    {activities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))}
                </div>
            </div>
        </section>
    );
}
