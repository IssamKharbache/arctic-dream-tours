import { ActivitiesSection } from "@/components/activities/ActivitySection";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/hero/HeroSection";
import { WhyChooseUs } from "@/components/main/WhyChooseUs";
import { getData } from "@/lib/getData";
import { baseUrl } from "@/utils/baseUrl";

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
    createdAt: string;
    updatedAt: string;
    seasonType?: SeasonType;
}
const HomePage = async () => {
    const res = await getData<{ data: Activity[] }>(
        `${baseUrl}/api/activity/get-all`,
    );
    const activities = res.data;
    const summerActivities = activities.filter(
        (a) => a.seasonType === "SUMMER",
    );
    const winterActivities = activities.filter(
        (a) => a.seasonType === "WINTER",
    );

    return (
        <div>
            {/* Hero Section */}
            <HeroSection />
            {/* activities cards Section */}
            {/* Summer Activities Section */}
            <ActivitiesSection
                title="Summer Adventures"
                description="Experience the magic of Finnish summer with midnight sun, pristine lakes, and endless outdoor activities."
                activities={summerActivities}
            />

            {/* Winter Activities Section */}
            <ActivitiesSection
                title="Winter Wonderland"
                description="Discover the enchanting Finnish winter with northern lights, snow-covered landscapes, and unique Arctic experiences."
                activities={winterActivities}
            />
            {/* why choose us*/}
            <WhyChooseUs />
            {/* Footer */}
            <Footer />
        </div>
    );
};
export default HomePage;
