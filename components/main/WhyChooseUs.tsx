import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, MapPin, Camera, Shield, Globe } from "lucide-react";
import { useTranslations } from "next-intl";

export function WhyChooseUs() {
  const t = useTranslations("features");
  const features = [
    {
      icon: Users,
      title: t("feature1_title"),
      description: t("feature1_description"),
    },
    {
      icon: Clock,
      title: t("feature2_title"),
      description: t("feature2_description"),
    },
    {
      icon: MapPin,
      title: t("feature3_title"),
      description: t("feature3_description"),
    },
    {
      icon: Globe,
      title: t("feature4_title"),
      description: t("feature4_description"),
    },
    {
      icon: Camera,
      title: t("feature5_title"),
      description: t("feature5_description"),
    },
    {
      icon: Shield,
      title: t("feature6_title"),
      description: t("feature6_description"),
    },
  ];

  return (
    <section
      className="py-16 px-4 md:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/aurora.jpg')",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Experience Finland with confidence through our expert-guided
            adventures and personalized service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="bg-white/85  hover:bg-white hover:-rotate-1 hover:-translate-y-1 transition-all duration-300 ease-in-out border-0 "
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-primary/20 rounded-full">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
