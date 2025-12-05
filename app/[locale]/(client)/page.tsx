import { ActivitiesSection } from "@/components/activities/ActivitySection";
import { BlogCarouselSection } from "@/components/blog/BlogCarouselSection";
import HeroSection from "@/components/hero/HeroSection";
import PromoDialog from "@/components/hero/PromoDialog";
import Gallery from "@/components/main/Gallery";
import { WhyChooseUs } from "@/components/main/WhyChooseUs";
import { getData } from "@/lib/getData";
import { baseUrl } from "@/utils/baseUrl";
import { Blog } from "@prisma/client";

const HomePage = async () => {
  // const response = await getData<{ data: Blog[] }>(
  //   `${baseUrl}/api/blog/get-all`
  // );
  // const blogs = response.data;
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
      {/* <PremiumServices /> */}
      {/* Gallery */}
      <Gallery />
      {/* Blog Carousel Section */}
      {/* {blogs.length > 0 ? <BlogCarouselSection blogs={blogs} /> : null} */}
    </div>
  );
};
export default HomePage;
