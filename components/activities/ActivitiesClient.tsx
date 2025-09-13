"use client";

import { useState, useMemo } from "react";
import { ActivitiesFilters } from "./ActivitiesFilters";
import { ActivitiesEmptyState } from "./ActivitiesEmptyState";
import { ActivitiesSection } from "./ActivitiesSection";
import type { Activity } from "@/types/activity";

interface ActivitiesClientProps {
  initialActivities: Activity[];
}

export function ActivitiesClient({ initialActivities }: ActivitiesClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");

  const filteredActivities = useMemo(() => {
    return initialActivities.filter((activity) => {
      const matchesSearch =
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.shortDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDifficulty =
        selectedDifficulty === "ALL" ||
        activity.difficulty === selectedDifficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [initialActivities, searchTerm, selectedDifficulty]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDifficulty("ALL");
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <ActivitiesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
      />

      {filteredActivities.length === 0 ? (
        <ActivitiesEmptyState onClearFilters={handleClearFilters} />
      ) : (
        <ActivitiesSection
          title="All Activities"
          description="Explore all available adventures."
          color="text-orange-500"
          activities={filteredActivities}
        />
      )}
    </div>
  );
}
