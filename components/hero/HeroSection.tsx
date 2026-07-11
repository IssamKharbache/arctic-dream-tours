"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const t = useTranslations("hero");
  const heroSlides = [
    {
      title: t("slides.0.title"),
      description: t("slides.0.description"),
      imageUrl: "/hero/hero1.jpeg",
    },
    {
      title: t("slides.1.title"),
      description: t("slides.1.description"),
      imageUrl: "/hero/hero2.jpg",
    },
    {
      title: t("slides.2.title"),
      description: t("slides.2.description"),
      imageUrl: "/hero/hero3.jpeg",
    },
  ];

  useEffect(() => {
    if (isAnimating) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 12000); // Keep the 6-second interval

    return () => clearInterval(interval);
  }, [heroSlides.length, isAnimating]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === current) return;

    setIsAnimating(true);
    setDirection(index > current ? 1 : -1);
    setCurrent(index);

    // Reset animation lock after a delay
    setTimeout(() => setIsAnimating(false), 1000);
  };

  // Original slide animation variants (simple left/right)
  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeInOut",
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeInOut",
      },
    }),
  };

  // Keep the enhanced blurry text animation variants
  const textVariants: Variants = {
    initial: { opacity: 0, y: 40, filter: "blur(10px)" },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.33, 1, 0.68, 1],
        delay: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      filter: "blur(10px)",
      transition: {
        duration: 0.8,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  // Background overlay variants
  const overlayVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 0.4,
      transition: { duration: 0.8 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.7 },
    },
  };

  const slide = heroSlides[current];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 z-0"
        >
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <motion.div
            className="absolute inset-0 bg-[#003d68]/40"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`title-${current}`}
            custom={direction}
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="will-change-transform"
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight text-white drop-shadow-lg">
              {slide.title}
            </h1>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`desc-${current}`}
            custom={direction}
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ delay: 0.3 }}
            className="will-change-transform max-w-2xl"
          >
            <p className="text-lg md:text-xl mb-8 font-normal opacity-90 text-white drop-shadow-md">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-8">
          {heroSlides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-3 h-3 hover:cursor-pointer transition-colors rounded-full ${
                current === index ? "bg-white/70" : "bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              animate={{
                scale: current === index ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: current === index ? Infinity : 0,
                repeatDelay: 3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar indicator */}
      <div className="absolute bottom-4 left-0 right-0 z-10 px-4">
        <div className="max-w-4xl mx-auto h-1 bg-white/20 rounded overflow-hidden">
          <motion.div
            key={current}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 12, ease: "linear" }}
            className="h-full bg-white/70"
          />
        </div>
      </div>
    </section>
  );
}
