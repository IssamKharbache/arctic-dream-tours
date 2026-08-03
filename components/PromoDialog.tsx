"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useNewPackagesDialogStore } from "@/store/zustand/NewPackagesDialog";
import {
  X,
  Mountain,
  Plane,
  Sparkles,
  BedDouble,
  Compass,
  ArrowRight,
} from "lucide-react";
import { useEffect } from "react";

interface Package {
  id: "classic" | "dream" | "ultimate";
  name: string;
  duration: string;
  priceWithHotel: number;
  priceWithoutHotel: number;
  popular?: boolean;
}

const PACKAGES: Package[] = [
  {
    id: "classic",
    name: "Lapland Classic",
    duration: "4 DAYS / 3 NIGHTS",
    priceWithHotel: 2550,
    priceWithoutHotel: 1050,
  },
  {
    id: "dream",
    name: "Lapland Dream",
    duration: "6 DAYS / 5 NIGHTS",
    priceWithHotel: 4580,
    priceWithoutHotel: 1580,
  },
  {
    id: "ultimate",
    name: "Full Lapland Experience",
    duration: "8 DAYS / 7 NIGHTS",
    priceWithHotel: 7630,
    priceWithoutHotel: 2380,
    popular: true,
  },
];

export default function NewPackagesDialog() {
  const { open, setOpen } = useNewPackagesDialogStore();

  useEffect(() => {
    setOpen(true);
  }, [setOpen]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-packages-title"
    >
      <div
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-400/20 shadow-[0_0_100px_rgba(34,211,238,.2)]">
        {/* Real aurora photo background */}
        <Image
          src="/aurora.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/90" />

        <button
          onClick={() => setOpen(false)}
          aria-label="Close dialog"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="relative max-h-[85vh] overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="relative inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-bold tracking-wide text-emerald-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              NEW
            </span>
            <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold tracking-wide text-cyan-300 backdrop-blur-sm">
              2026 / 2027 SEASON
            </span>
          </div>

          {/* Big heading */}
          <h2
            id="new-packages-title"
            className="mt-4 flex items-center gap-2 text-3xl font-bold text-white drop-shadow-lg sm:text-4xl"
          >
            <Sparkles className="h-7 w-7 shrink-0 text-emerald-300" />
            Our New Packages
          </h2>

          <p className="mt-3 max-w-lg text-sm text-slate-200 drop-shadow sm:text-base">
            Explore the Arctic like never before. Unforgettable adventures await
            this winter season.
          </p>

          {/* Package cards — text only, no images */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`flex flex-col rounded-xl border p-4 backdrop-blur-md ${
                  pkg.popular
                    ? "border-amber-400/50 bg-amber-400/5"
                    : "border-white/10 bg-slate-950/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-white">{pkg.name}</h3>
                  {pkg.popular && (
                    <span className="shrink-0 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-bold tracking-wide text-slate-900">
                      POPULAR
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] font-medium tracking-wide text-slate-400">
                  {pkg.duration}
                </p>
                <p className="mt-3 text-sm text-white">
                  From{" "}
                  <span className="font-bold text-emerald-300">
                    €{pkg.priceWithoutHotel}
                  </span>
                  <span className="text-slate-400"> /person</span>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-slate-300">
            We handle your accommodation, activities, and airport transfers — so
            you don&apos;t have to.
          </p>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Maybe later
            </button>

            <Link
              href="/packages"
              onClick={() => setOpen(false)}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 text-sm font-bold text-slate-900 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(34,211,238,.45)]"
            >
              <Mountain className="h-4 w-4 shrink-0" />
              Explore Packages
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
