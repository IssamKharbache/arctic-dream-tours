"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Users, Award, Snowflake, Mountain } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function AboutPage() {
  const t = useTranslations("about");

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const experiences = [
    {
      icon: <Snowflake className="w-8 h-8" />,
      title: t("experiences.items.northernLights.title"),
      description: t("experiences.items.northernLights.description"),
    },
    {
      icon: <Mountain className="w-8 h-8" />,
      title: t("experiences.items.husky.title"),
      description: t("experiences.items.husky.description"),
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t("experiences.items.reindeer.title"),
      description: t("experiences.items.reindeer.description"),
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t("experiences.items.iceHotels.title"),
      description: t("experiences.items.iceHotels.description"),
    },
  ];

  const testimonials = [
    {
      name: t("testimonials.items.sarah.name"),
      country: t("testimonials.items.sarah.country"),
      text: t("testimonials.items.sarah.text"),
      rating: 5,
    },
    {
      name: t("testimonials.items.marco.name"),
      country: t("testimonials.items.marco.country"),
      text: t("testimonials.items.marco.text"),
      rating: 5,
    },
    {
      name: t("testimonials.items.emma.name"),
      country: t("testimonials.items.emma.country"),
      text: t("testimonials.items.emma.text"),
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/about/aurora.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <motion.div
          className="relative z-10 text-center text-white px-4 max-w-4xl"
          {...fadeInUp}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-black mb-6 text-balance"
            {...fadeInUp}
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-pretty leading-relaxed"
            {...fadeInUp}
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div {...fadeInUp}>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                {t("hero.button")}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <motion.section
        className="py-20 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 text-balance">
                {t("about.heading")}
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>{t("about.paragraph1")}</p>
                <p>{t("about.paragraph2")}</p>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-primary mb-2">
                    15+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("about.stats.years")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-primary mb-2">
                    5000+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("about.stats.travelers")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-primary mb-2">
                    50+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("about.stats.experiences")}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div className="relative w-full max-w-3xl mx-auto">
                <video
                  src="/about/huskies.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-xl shadow-xl border">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold">{t("about.location")}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Experiences Section */}
      <motion.section
        className="py-20 px-4 bg-muted"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 text-balance">
              {t("experiences.heading")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              {t("experiences.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {experiences.map((experience, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card">
                  <CardContent className="p-8 text-center">
                    <div className="text-primary mb-4 flex justify-center">
                      {experience.icon}
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground mb-4">
                      {experience.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {experience.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-20 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 text-balance">
              {t("testimonials.heading")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              {t("testimonials.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-card">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="text-card-foreground mb-6 leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                    <div>
                      <div className="font-semibold text-card-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.country}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 bg-primary text-primary-foreground"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-balance">
            {t("cta.heading")}
          </h2>
          <p className="text-xl mb-8 text-pretty leading-relaxed opacity-90">
            {t("cta.subtitle")}
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              variant="secondary"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {t("cta.button")}
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
