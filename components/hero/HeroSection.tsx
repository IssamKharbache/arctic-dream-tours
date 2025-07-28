"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";

const heroSlides = [
    {
        title: "Discover Unforgettable Adventures in Finland",
        description:
            "Explore the beauty of Finland with curated activities designed for unforgettable memories.",
        imageUrl: "/hero/hero1.jpg",
    },
    {
        title: "From Arrival to Adventure — We've Got You Covered",
        description:
            "We help you plan, arrive, and dive into the best Finnish experiences without worry.",
        imageUrl: "/hero/hero2.jpg",
    },
    {
        title: "Activities That Create Lasting Memories",
        description:
            "Enjoy authentic and memorable activities backed by our trusted local expertise.",
        imageUrl: "/hero/hero3.jpg",
    },
];

export default function HeroSection() {
    const [current, setCurrent] = useState(0);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setInitialLoad(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const goToSlide = (index: number) => {
        setCurrent(index);
    };

    const slideVariants: Variants = {
        enter: { x: "100%", opacity: 1 },
        center: { x: 0, opacity: 1 },
        exit: { x: "-100%", opacity: 1 },
    };

    const textVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const slide = heroSlides[current];

    return (
        <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
            <AnimatePresence initial={false}>
                <motion.div
                    key={current}
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

            <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                <motion.div
                    initial={initialLoad ? "hidden" : false}
                    animate="visible"
                    variants={textVariants}
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        {slide.title}
                    </h1>
                </motion.div>

                <motion.div
                    initial={initialLoad ? "hidden" : false}
                    animate="visible"
                    variants={textVariants}
                    transition={{ delay: 0.2 }}
                >
                    <p className="text-xl  md:text-2xl mb-8 font-normal opacity-90">
                        {slide.description}
                    </p>
                </motion.div>

                <motion.div
                    initial={initialLoad ? "hidden" : false}
                    animate="visible"
                    variants={textVariants}
                    transition={{ delay: 0.4 }}
                    className="mb-12"
                >
                    <Button
                        size="lg"
                        className="bg-white hover:bg-slate-200 text-[#003d68] px-8 py-4 text-lg duration-300"
                    >
                        Start Your Arctic Journey
                    </Button>
                </motion.div>

                <div className="flex justify-center gap-2 mt-4">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 transition-colors ${
                                current === index ? "bg-white" : "bg-white/50"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
