"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hotel, Home, Mountain, Snowflake } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function PremiumServices() {
  const t = useTranslations("premium");

  // link icons + images with translation keys
  const accommodations = [
    {
      id: "luxuryHotels",
      icon: Hotel,
      image: "/premiums/luxuryHotel.jpg",
    },
    {
      id: "privateApartments",
      icon: Home,
      image: "/premiums/appartment.jpg",
    },
    {
      id: "villas",
      icon: Mountain,
      image: "/premiums/villa.jpg",
    },
    {
      id: "iceHotels",
      icon: Snowflake,
      image: "/premiums/igloo.jpg",
    },
  ].map((item, idx) => ({
    ...item,
    title: t(`accommodations.${item.id}.title`),
    description: t(`accommodations.${item.id}.description`),
    features: t.raw(`accommodations.${item.id}.features`) as string[],
  }));

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="relative container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={titleVariants}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            {t("title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Accommodation Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {accommodations.map((accommodation) => {
            const IconComponent = accommodation.icon;
            return (
              <motion.div
                key={accommodation.id}
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                className="group"
              >
                <Card className="h-full bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={accommodation.image}
                        alt={accommodation.title}
                        className="w-full h-72 object-cover block rounded-2xl mb-8"
                      />
                      <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm rounded-full p-3">
                        <IconComponent className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-card-foreground mb-3">
                        {accommodation.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {accommodation.description}
                      </p>

                      <div className="space-y-2 mb-6">
                        {accommodation.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm text-muted-foreground"
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link href="/contact">
            <motion.div
              whileHover={{
                scale: 1.08,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="px-10 py-8 text-lg font-medium transition-all rounded-3xl text-white duration-300"
              >
                {t("button")}
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
