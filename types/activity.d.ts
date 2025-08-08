type SeasonType = "SUMMER" | "WINTER" | "ALL";

export interface Activity {
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    cancellationPolicy: string;
    included: string[];
    difficulty: "EASY" | "MODERATE" | "HARD";
    bring: string;
    tags: string[];
    duration: string;
    meetingPoints: string[];
    bookingCutoffHours: number;
    liveTourGuide: boolean;
    location: string;
    adultPrice: number;
    childPrice: number;
    imageUrl: string;
    imageKey: string;
    startDate: Date;
    endDate: Date;
    createdAt: string;
    updatedAt: string;
    seasonType?: SeasonType;
}
