"use client";
import { Search, Filter, Snowflake, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ActivitiesFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedSeason: "ALL" | "WINTER" | "SUMMER";
  setSelectedSeason: (value: "ALL" | "WINTER" | "SUMMER") => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (value: string) => void;
}

export function ActivitiesFilters({
  searchTerm,
  setSearchTerm,
  selectedSeason,
  setSelectedSeason,
  selectedDifficulty,
  setSelectedDifficulty,
}: ActivitiesFiltersProps) {
  return (
    <section className="py-8 border-b bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search activities, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter by:</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant={selectedSeason === "ALL" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSeason("ALL")}
              >
                All Seasons
              </Button>
              <Button
                variant={selectedSeason === "WINTER" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSeason("WINTER")}
                className="flex items-center gap-1"
              >
                <Snowflake className="h-3 w-3" />
                Winter
              </Button>
              <Button
                variant={selectedSeason === "SUMMER" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSeason("SUMMER")}
                className="flex items-center gap-1"
              >
                <Sun className="h-3 w-3" />
                Summer
              </Button>
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1 rounded-md border border-border bg-background text-sm"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MODERATE">Moderate</option>
              <option value="HARD">Hard</option>
              <option value="EXTREME">Extreme</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
