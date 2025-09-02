"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Activity } from "@/types/activity";
import { Search, Filter, Snowflake, Sun, MapPin, Calendar } from "lucide-react";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { baseUrl } from "@/utils/baseUrl";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeason, setSelectedSeason] = useState<
    "ALL" | "WINTER" | "SUMMER"
  >("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, selectedSeason, selectedDifficulty]);

  const fetchActivities = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${baseUrl}/api/activity/get-all`);
      const data = await response.json();
      setActivities(data.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      // Mock data for demonstration
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.shortDescription
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          activity.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSeason !== "ALL") {
      filtered = filtered.filter(
        (activity) => activity.seasonType === selectedSeason
      );
    }

    if (selectedDifficulty !== "ALL") {
      filtered = filtered.filter(
        (activity) => activity.difficulty === selectedDifficulty
      );
    }

    setFilteredActivities(filtered);
  };
  const winterActivities = Array.isArray(filteredActivities)
    ? filteredActivities.filter((activity) => activity.seasonType === "WINTER")
    : [];

  const summerActivities = Array.isArray(filteredActivities)
    ? filteredActivities.filter((activity) => activity.seasonType === "SUMMER")
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Loading amazing activities...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 ">
        <div className="container mx-auto px-4 mt-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Discover Finland's
              <span className="text-primary block">Amazing Activities</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Experience the best of Finnish nature through our carefully
              curated outdoor adventures. From winter wonderlands to summer
              midnight sun, create unforgettable memories.
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

      {/* Search and Filter Section */}
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
                <span className="text-sm text-muted-foreground">
                  Filter by:
                </span>
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

      {/* Activities Content */}
      <main className="container mx-auto px-4 py-12">
        {filteredActivities.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No activities found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSeason("ALL");
                  setSelectedDifficulty("ALL");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-16">
            {/* Winter Activities */}
            {(selectedSeason === "ALL" || selectedSeason === "WINTER") &&
              winterActivities.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center gap-2">
                      <Snowflake className="h-6 w-6 text-blue-500" />
                      <h2 className="text-3xl font-bold text-foreground">
                        Winter Activities
                      </h2>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {winterActivities.length}{" "}
                      {winterActivities.length === 1
                        ? "Activity"
                        : "Activities"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Embrace the magic of Finnish winter with snow-covered
                    adventures and northern lights experiences.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {winterActivities.map((activity) => (
                      <ActivityCard key={activity.id} activity={activity} />
                    ))}
                  </div>
                </section>
              )}

            {/* Summer Activities */}
            {(selectedSeason === "ALL" || selectedSeason === "SUMMER") &&
              summerActivities.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center gap-2">
                      <Sun className="h-6 w-6 text-orange-500" />
                      <h2 className="text-3xl font-bold text-foreground">
                        Summer Activities
                      </h2>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-800"
                    >
                      {summerActivities.length}{" "}
                      {summerActivities.length === 1
                        ? "Activity"
                        : "Activities"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Discover the beauty of Finnish summer with midnight sun
                    adventures and pristine nature experiences.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {summerActivities.map((activity) => (
                      <ActivityCard key={activity.id} activity={activity} />
                    ))}
                  </div>
                </section>
              )}
          </div>
        )}
      </main>

      {/* Call to Action Section */}
      <section className="bg-primary/5 py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready for Your Finnish Adventure?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered the magic of Finland
            through our expertly guided activities. Book your next adventure
            today and create memories that will last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
