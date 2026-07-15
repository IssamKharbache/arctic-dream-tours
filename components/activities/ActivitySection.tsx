"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity } from "@/types/activity";
import { ActivityCard } from "./ActivityCard";
import { baseUrl } from "@/utils/baseUrl";
import { ActivityCardSkeleton } from "../skeletons/ActivityCardSkeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslations } from "next-intl";

async function fetchActivities(): Promise<Activity[]> {
  const res = await fetch(`${baseUrl}/api/activity/get-all`);
  const data = await res.json();
  return data.data;
}

export function ActivitiesSection() {
  const t = useTranslations("activity");
  const {
    data: activities = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
  });

  if (error) return <p>Error loading activities</p>;
  if (!isLoading && activities.length === 0) return null;

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("title.main")}
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("title.description")}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ActivityCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              navigation={{
                nextEl: ".custom-swiper-button-next",
                prevEl: ".custom-swiper-button-prev",
              }}
              pagination={{
                clickable: true,
                el: ".custom-pagination",
                bulletClass: "custom-bullet",
                bulletActiveClass: "custom-bullet-active",
              }}
              autoplay={{
                delay: 7000,
                disableOnInteraction: false,
              }}
              loop={true}
              className="pb-12"
            >
              {activities.map((activity) => (
                <SwiperSlide key={activity.id}>
                  <div className="h-full py-2">
                    <ActivityCard activity={activity} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button className="custom-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-blue-50 transition-colors duration-200 border border-gray-200">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>

            <button className="custom-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-blue-50 transition-colors duration-200 border border-gray-200">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>

            {/* Custom Pagination */}
            <div className="custom-pagination flex justify-center mt-6 space-x-2"></div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-bullet {
          display: inline-block;
          width: 12px;
          height: 12px;
          background-color: #d1d5db;
          border-radius: 50%;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .custom-bullet-active {
          background-color: #3b82f6;
          transform: scale(1.2);
        }

        .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
}
