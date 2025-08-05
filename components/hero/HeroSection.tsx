"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTranslations } from "next-intl";

export default function HeroSection() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    const t = useTranslations("hero");
    const heroSlides = [
        {
            title: t("slides.0.title"),
            description: t("slides.0.description"),
            imageUrl: "/hero/hero1.jpg",
        },
        {
            title: t("slides.1.title"),
            description: t("slides.1.description"),
            imageUrl: "/hero/hero2.jpg",
        },
        {
            title: t("slides.2.title"),
            description: t("slides.2.description"),
            imageUrl: "/hero/hero3.jpg",
        },
    ];
    useEffect(() => {
        const interval = setInterval(() => {
            setDirection(1);
            setCurrent((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const goToSlide = (index: number) => {
        setDirection(index > current ? 1 : -1);
        setCurrent(index);
    };

    // Slide animation variants
    const slideVariants: Variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 1,
        }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({
            x: direction > 0 ? "-100%" : "100%",
            opacity: 1,
        }),
    };

    // Text animation variants
    const textVariants: Variants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
            },
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.6,
            },
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
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-[#003d68]/40" />
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
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
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
                        transition={{ delay: 0.1 }}
                        className="will-change-transform"
                    >
                        <p className="text-xl md:text-2xl mb-8 font-normal opacity-90 text-white">
                            {slide.description}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={`button-${current}`}
                        custom={direction}
                        variants={textVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ delay: 0.2 }}
                        className="mb-12 will-change-transform"
                    ></motion.div>
                </AnimatePresence>

                <div className="flex justify-center gap-2 mt-4">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 hover:cursor-pointer transition-colors rounded-full ${
                                current === index
                                    ? "bg-white/70 scale-125"
                                    : "bg-white/40"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
