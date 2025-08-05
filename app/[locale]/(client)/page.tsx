import { ActivitiesSection } from "@/components/activities/ActivitySection";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/hero/HeroSection";
import Gallery from "@/components/main/Gallery";
import { WhyChooseUs } from "@/components/main/WhyChooseUs";
import { getData } from "@/lib/getData";
import { Activity } from "@/types/activity";
import { baseUrl } from "@/utils/baseUrl";

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
            {/* Winter Activities Section */}
            <ActivitiesSection
                title="Winter Wonderland"
                description="Discover the enchanting Finnish winter with northern lights, snow-covered landscapes, and unique Arctic experiences."
                activities={winterActivities}
            />
            {/* Summer Activities Section */}
            <ActivitiesSection
                title="Summer Adventures"
                description="Experience the magic of Finnish summer with midnight sun, pristine lakes, and endless outdoor activities."
                activities={summerActivities}
            />

            {/* why choose us*/}
            <WhyChooseUs />
            {/* Gallery */}
            <Gallery />
            {/* Footer */}
            <Footer />
        </div>
    );
};
export default HomePage;
