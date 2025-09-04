"use client";
import { useState, useEffect } from "react";
import { ActivitiesHero } from "@/components/activities/ActivitiesHero";
import { ActivitiesFilters } from "@/components/activities/ActivitiesFilters";
import { ActivitiesEmptyState } from "@/components/activities/ActivitiesEmptyState";
import { baseUrl } from "@/utils/baseUrl";
import type { Activity } from "@/types/activity";
import { Snowflake, Sun } from "lucide-react";
import { ActivitiesSection } from "@/components/activities/ActivitiesSection";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeason, setSelectedSeason] = useState<
    "ALL" | "WINTER" | "SUMMER"
  >("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");

  useEffect(() => {
    fetch(`${baseUrl}/api/activity/get-all`)
      .then((res) => res.json())
      .then((data) => setActivities(data.data))
      .catch(() => setActivities([]));
  }, []);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.shortDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeason =
      selectedSeason === "ALL" || activity.seasonType === selectedSeason;
    const matchesDifficulty =
      selectedDifficulty === "ALL" ||
      activity.difficulty === selectedDifficulty;
    return matchesSearch && matchesSeason && matchesDifficulty;
  });

  const winterActivities = filteredActivities.filter(
    (a) => a.seasonType === "WINTER"
  );
  const summerActivities = filteredActivities.filter(
    (a) => a.seasonType === "SUMMER"
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSeason("ALL");
    setSelectedDifficulty("ALL");
  };

  return (
    <div className="min-h-screen bg-background">
      <ActivitiesHero />
      <ActivitiesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
      />

      <main className="container mx-auto px-4 py-12 space-y-16">
        {filteredActivities.length === 0 ? (
          <ActivitiesEmptyState onClearFilters={handleClearFilters} />
        ) : (
          <>
            {(selectedSeason === "ALL" || selectedSeason === "WINTER") &&
              winterActivities.length > 0 && (
                <ActivitiesSection
                  title="Winter Activities"
                  description="Embrace the magic of Finnish winter."
                  icon={<Snowflake className="h-6 w-6 text-blue-500" />}
                  color="text-blue-500"
                  activities={winterActivities}
                />
              )}
            {(selectedSeason === "ALL" || selectedSeason === "SUMMER") &&
              summerActivities.length > 0 && (
                <ActivitiesSection
                  title="Summer Activities"
                  description="Enjoy Finnish summer adventures."
                  icon={<Sun className="h-6 w-6 text-orange-500" />}
                  color="text-orange-500"
                  activities={summerActivities}
                />
              )}
          </>
        )}
      </main>
    </div>
  );
}
