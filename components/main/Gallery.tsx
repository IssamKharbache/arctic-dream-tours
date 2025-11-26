"use client";

import { useState, useRef, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";

// Your image slides
import { slides as imageSlides } from "@/utils/getGalleryImages";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface VideoSlide {
  id: number;
  src: string;
  type: "video";
  width: number;
  height: number;
  sources: Array<{ src: string; type: string }>;
  thumb?: string;
}

export default function GalleryViewer() {
  const [videoSlides, setVideoSlides] = useState<VideoSlide[]>([]);
  const [videoThumbnails, setVideoThumbnails] = useState<{
    [key: number]: string;
  }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ===== Generate video slides =====
  useEffect(() => {
    const slides: VideoSlide[] = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      src: `/gallery/video/${i + 1}.mp4`,
      type: "video",
      width: 1280,
      height: 720,
      sources: [{ src: `/gallery/video/${i + 1}.mp4`, type: "video/mp4" }],
    }));
    setVideoSlides(slides);
  }, []);

  // ===== Capture first frame of videos =====
  const captureVideoThumbnail = (
    videoElement: HTMLVideoElement,
    videoId: number
  ) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL("image/jpeg");
        setVideoThumbnails((prev) => ({
          ...prev,
          [videoId]: thumbnailUrl,
        }));
      }
    }
  };

  const handleVideoLoaded = (videoId: number) => {
    const video = videoRefs.current[videoId];
    if (video) {
      // Seek to beginning and capture frame
      video.currentTime = 0.1; // Small offset to ensure frame is available
      setTimeout(() => {
        captureVideoThumbnail(video, videoId);
      }, 100);
    }
  };

  // FINAL merged slides for lightbox
  const finalSlides = [
    ...imageSlides.map((img) => ({
      type: "image" as const,
      src: img.src,
      alt: img.alt ?? "",
    })),
    ...videoSlides,
  ];

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Fixed openLightbox function
  const openLightbox = (slideIndex: number, type: "image" | "video") => {
    let lightboxIndex;

    if (type === "image") {
      // For images, the index in the lightbox is the same as the image index
      lightboxIndex = slideIndex;
    } else {
      // For videos, the index in the lightbox is after all images
      lightboxIndex = imageSlides.length + slideIndex;
    }

    setIndex(lightboxIndex);
    setOpen(true);
  };

  const nextImageSlide = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageSlides.length);
  };

  const prevImageSlide = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + imageSlides.length) % imageSlides.length
    );
  };

  const nextVideoSlide = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videoSlides.length);
  };

  const prevVideoSlide = () => {
    setCurrentVideoIndex(
      (prev) => (prev - 1 + videoSlides.length) % videoSlides.length
    );
  };

  return (
    <div className="space-y-12 p-5">
      {/* Hidden canvas for thumbnail generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ---------- IMAGE CAROUSEL ---------- */}
      <section>
        <h2 className="font-semibold text-2xl  md:text-5xl mb-4 text-center mt-8">
          Our gallery
        </h2>
        <div className="relative  rounded-xl p-4">
          {/* Main Image Display */}
          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-2xl group">
              <img
                src={imageSlides[currentImageIndex]?.src}
                alt={imageSlides[currentImageIndex]?.alt || ""}
                onClick={() => openLightbox(currentImageIndex, "image")}
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg cursor-pointer shadow-lg transition-all duration-300 group-hover:opacity-90"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="bg-black/60 text-white px-4 py-2 rounded-lg font-semibold">
                  Show Full Screen
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImageSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white h-8 w-8 rounded-full transition-all hover:bg-black/80 flex items-center justify-center"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={nextImageSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white h-8 w-8 rounded-full transition-all hover:bg-black/80 flex items-center justify-center"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          {/* Image Thumbnail Strip */}
          <div className="flex space-x-2 overflow-x-auto py-2 px-4">
            {imageSlides.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt || ""}
                onClick={() => setCurrentImageIndex(i)}
                className={`h-16 w-24 object-cover rounded cursor-pointer transition-all ${
                  i === currentImageIndex
                    ? "ring-2 ring-blue-500 scale-105"
                    : "opacity-70 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* <section>
        <div className="relative  rounded-xl p-4">
          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-2xl">
              {videoSlides.map((video) => (
                <video
                  key={video.id}
                  ref={(el) => {
                    videoRefs.current[video.id] = el;
                  }}
                  onLoadedData={() => handleVideoLoaded(video.id)}
                  onCanPlay={() => handleVideoLoaded(video.id)}
                  onLoadedMetadata={() => handleVideoLoaded(video.id)}
                  className="hidden"
                  preload="auto"
                  crossOrigin="anonymous"
                >
                  <source src={video.src} type="video/mp4" />
                </video>
              ))}

              <div
                onClick={() => openLightbox(currentVideoIndex, "video")}
                className="relative w-full h-64 sm:h-80 md:h-96 bg-black rounded-lg cursor-pointer group overflow-hidden"
              >
                {videoThumbnails[videoSlides[currentVideoIndex]?.id] ? (
                  <img
                    src={videoThumbnails[videoSlides[currentVideoIndex]?.id]}
                    alt={`Video ${videoSlides[currentVideoIndex]?.id}`}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-2xl mb-2">Loading thumbnail...</div>
                      <div className="text-sm">Generating preview</div>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/60 text-white p-4 rounded-full flex items-center gap-2 transition-all   group-hover:scale-110">
                    <Play className="h-8 w-8" />
                  </div>
                </div>
              </div>

              <button
                onClick={prevVideoSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white h-8 w-8 rounded-full transition-all hover:bg-black/80 flex items-center justify-center"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={nextVideoSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white h-8 w-8 rounded-full transition-all hover:bg-black/80 flex items-center justify-center"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="flex space-x-2 overflow-x-auto py-2 px-4">
            {videoSlides.map((video, i) => (
              <div
                key={video.id}
                onClick={() => setCurrentVideoIndex(i)}
                className={`relative h-16 w-24 rounded cursor-pointer transition-all flex-shrink-0 ${
                  i === currentVideoIndex
                    ? "ring-2 ring-blue-500 scale-105"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                {videoThumbnails[video.id] ? (
                  <img
                    src={videoThumbnails[video.id]}
                    alt={`Video ${video.id}`}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center">
                    <div className="text-white text-xs text-center">
                      Loading
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-sm bg-black/50 rounded-full p-1">
                    ▶
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ---------- LIGHTBOX ---------- */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={finalSlides}
        plugins={[Download, Fullscreen, Zoom, Video]}
        styles={{
          container: { backgroundColor: "rgba(0,0,0,0.95)" },
        }}
      />
    </div>
  );
}
