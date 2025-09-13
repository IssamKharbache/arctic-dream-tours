"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import Swiper from "swiper";
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectCoverflow,
} from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { slides } from "@/utils/getGalleryImages";
import { Download, Fullscreen, Zoom } from "yet-another-react-lightbox/plugins";
import { useTranslations } from "next-intl";

const Gallery = () => {
  const swiperRef = useRef<any>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const t = useTranslations("gallery");

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = new Swiper(swiperRef.current, {
        modules: [Navigation, Pagination, Autoplay, EffectCoverflow],
        slidesPerView: 1.6,
        spaceBetween: 1,
        centeredSlides: true,
        loop: slides.length > 1,
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
        effect: "coverflow",
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        },
        speed: 800,
      });

      return () => {
        if (swiper) {
          swiper.destroy();
        }
      };
    }
  }, []);

  const openLightbox = (imageIndex: number) => {
    setPhotoIndex(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-12">
            {/* Top - Title and Description */}
            <div className="w-full text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t("title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-3xl mx-auto">
                {t("description")}
              </p>
            </div>

            {/* Bottom - Carousel */}
            <div className="w-full">
              <div className="relative">
                <div ref={swiperRef} className="swiper overflow-hidden">
                  <div className="swiper-wrapper">
                    {slides.map((image, index) => (
                      <div key={image.id} className="swiper-slide relative">
                        <div
                          className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-500"
                          onClick={() => openLightbox(index)}
                        >
                          <div className="aspect-[15/12] relative">
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-medium bg-transparent bg-opacity-50 px-3 py-1 rounded border">
                                {t("viewFullscreen")}
                              </div>
                            </div>
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

      {/* Lightbox */}
      <Lightbox
        plugins={[Download, Fullscreen, Zoom]}
        captions={{
          showToggle: true,
          descriptionTextAlign: "end",
        }}
        open={lightboxOpen}
        close={closeLightbox}
        slides={slides}
        index={photoIndex}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          slide: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      />
    </>
  );
};

export default Gallery;
