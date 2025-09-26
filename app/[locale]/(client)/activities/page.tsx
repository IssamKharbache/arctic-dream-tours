import { ActivitiesHero } from "@/components/activities/ActivitiesHero";
import { baseUrl } from "@/utils/baseUrl";
import type { Activity } from "@/types/activity";
import { ActivitiesClient } from "@/components/activities/ActivitiesClient";

export const metadata = {
  title: "Activities",
  description:
    "Explore Lapland adventures with Arctic Dream Tours. Book husky sledding, Northern Lights tours, reindeer safaris, and more.",
};
export default async function ActivitiesPage() {
  // Fetch activities on the server
  const res = await fetch(`${baseUrl}/api/activity/get-all`);
  const data = await res.json();
  const activities: Activity[] = data?.data || [];

  return (
    <div className="min-h-screen bg-background">
      <ActivitiesHero />
      {/* Pass activities to client component */}
      <ActivitiesClient initialActivities={activities} />
    </div>
  );
}
