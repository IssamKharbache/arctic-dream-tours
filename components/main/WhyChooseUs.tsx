import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, MapPin, Coffee, Camera, Shield } from "lucide-react";

const features = [
    {
        icon: Users,
        title: "Authentic Finnish Expertise",
        description:
            "Experience Finland through the eyes of native guides who share generations of wilderness knowledge and cultural traditions.",
    },
    {
        icon: Clock,
        title: "Personalized Adventure Timing",
        description:
            "Every expedition is tailored to seasonal conditions and your schedule, ensuring optimal experiences from sunrise to midnight sun.",
    },
    {
        icon: MapPin,
        title: "Exclusive Wilderness Access",
        description:
            "Venture into untouched Finnish landscapes and private nature reserves that remain hidden from typical tourist routes.",
    },
    {
        icon: Coffee,
        title: "Nordic Comfort Experience",
        description:
            "Stay warm and energized with heated transportation, traditional Finnish beverages, and locally-sourced wilderness snacks.",
    },
    {
        icon: Camera,
        title: "Professional Memory Capture",
        description:
            "Our guides double as skilled photographers, documenting your Finnish adventure with stunning landscape and portrait photography.",
    },
    {
        icon: Shield,
        title: "Weather-Safe Guarantee",
        description:
            "Unpredictable Nordic weather won't ruin your plans - we provide alternative activities or complete tour refunds when nature doesn't cooperate.",
    },
];

export function WhyChooseUs() {
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
                        Experience Finland with confidence through our
                        expert-guided adventures and personalized service
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
