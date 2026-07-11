import { ActivitiesSection } from "@/components/activities/ActivitySection";
import HeroSection from "@/components/hero/HeroSection";
import PromoDialog from "@/components/hero/PromoDialog";
import Gallery from "@/components/main/Gallery";
import { WhyChooseUs } from "@/components/main/WhyChooseUs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arctic Dream Tours",
  description:
    "Explore unforgettable tours and activities in Finnish Lapland, including Northern Lights tours, husky safaris, reindeer rides, snowmobile adventures, ice fishing, and more with Arctic Dream Tours.",
};

const HomePage = async () => {
  return (
    <div>
      <PromoDialog />
      {/* Hero Section */}
      <HeroSection />
      {/* activities cards Section */}
      {/* Winter Activities Section */}
      <ActivitiesSection
        title="Winter Wonderland"
        description="Discover the enchanting Finnish winter with northern lights, snow-covered landscapes, and unique Arctic experiences."
      />
      {/* why choose us*/}
      <WhyChooseUs />
      {/* Gallery */}
      <Gallery />
    </div>
  );
};
export default HomePage;
