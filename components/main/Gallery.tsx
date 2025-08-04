"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Swiper from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Gallery images data
const galleryImages = Array.from({ length: 21 }, (_, i) => {
    const number = i + 1;
    return {
        id: number,
        src: `/gallery/${number}.jpeg`,
        alt: `Gallery image ${number}`,
        title: `Gallery Image ${number}`,
    };
});

const Gallery = () => {
    const swiperRef = useRef<any>(null);

    useEffect(() => {
        const loadSwiper = async () => {
            // Initialize Swiper
            if (swiperRef.current) {
                new Swiper(swiperRef.current, {
                    modules: [Navigation, Pagination, Autoplay],
                    slidesPerView: 1.6, // Shows more of the side images
                    spaceBetween: 0, // No gap between slides
                    centeredSlides: true,
                    loop: true,
                    autoplay: {
                        delay: 4000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                    },
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    },
                    breakpoints: {
                        640: {
                            slidesPerView: 1.7,
                            spaceBetween: 0,
                        },
                        768: {
                            slidesPerView: 1.8,
                            spaceBetween: 0,
                        },
                        1024: {
                            slidesPerView: 1.9,
                            spaceBetween: 0,
                        },
                    },
                    effect: "slide",
                    speed: 800,
                });
            }
        };

        loadSwiper();
    }, []);

    return (
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center gap-12">
                    {/* Top - Title and Description */}
                    <div className="w-full text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Our Gallery
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-3xl mx-auto">
                            Discover the breathtaking beauty of Finland through
                            our curated collection of adventure moments captured
                            by our expert guides.
                        </p>
                    </div>
                    {/* Bottom - Carousel */}
                    <div className="w-full">
                        <div className="relative">
                            <div
                                ref={swiperRef}
                                className="swiper overflow-hidden"
                            >
                                <div className="swiper-wrapper">
                                    {galleryImages.map((image, index) => (
                                        <div
                                            key={image.id}
                                            className="swiper-slide relative"
                                        >
                                            <div className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-500">
                                                <div className="aspect-[17/12] relative">
                                                    {" "}
                                                    {/* Changed aspect ratio here */}
                                                    <Image
                                                        src={
                                                            image.src ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={image.alt}
                                                        fill
                                                        className="object-cover transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation buttons */}
                            <div className="swiper-button-prev !text-primary !w-12 !h-12 !mt-0 !top-1/2 !-translate-y-1/2 !left-4 !bg-white !rounded-full !shadow-lg after:!text-base after:!font-bold hover:!bg-gray-50 transition-colors z-20"></div>
                            <div className="swiper-button-next !text-primary !w-12 !h-12 !mt-0 !top-1/2 !-translate-y-1/2 !right-4 !bg-white !rounded-full !shadow-lg after:!text-base after:!font-bold hover:!bg-gray-50 transition-colors z-20"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .swiper-slide {
                    transition: all 0.3s ease;
                }

                .swiper-slide-active {
                    z-index: 10;
                    transform: scale(1);
                }

                .swiper-slide:not(.swiper-slide-active) {
                    z-index: 1;
                    transform: scale(0.9);
                    opacity: 0.8;
                }

                .swiper-slide-prev,
                .swiper-slide-next {
                    z-index: 5;
                }
            `}</style>
        </section>
    );
};

export default Gallery;
