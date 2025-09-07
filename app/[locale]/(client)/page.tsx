import { ActivitiesSection } from "@/components/activities/ActivitySection";
import HeroSection from "@/components/hero/HeroSection";
import Gallery from "@/components/main/Gallery";
import { WhyChooseUs } from "@/components/main/WhyChooseUs";
import PremiumServices from "@/components/PremiumServices";

const HomePage = async () => {
  return (
    <div>
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
      <PremiumServices />
      {/* Gallery */}
      <Gallery />
    </div>
  );
};
export default HomePage;
