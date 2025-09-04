"use client";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ActivitiesEmptyStateProps {
  onClearFilters: () => void;
}

export function ActivitiesEmptyState({
  onClearFilters,
}: ActivitiesEmptyStateProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No activities found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}
