"use client";

import { Link } from "@/i18n/navigation";
import { useNewPackagesDialogStore } from "@/store/zustand/NewPackagesDialog";
import {
  X,
  Mountain,
  Plane,
  Sparkles,
  Snowflake,
  Compass,
  BedDouble,
  ArrowRight,
} from "lucide-react";
import { useEffect } from "react";

const SESSION_KEY = "lapland-packages-dialog-seen";

const highlights = [
  {
    icon: Snowflake,
    title: "Arctic Adventures",
    description:
      "Chase the Northern Lights and explore snow-covered wilderness.",
  },
  {
    icon: BedDouble,
    title: "Handpicked Stays",
    description:
      "Comfortable accommodation included for every night of your trip.",
  },
  {
    icon: Compass,
    title: "Guided Activities",
    description:
      "Husky sledding, snowmobiling, and more — all arranged for you.",
  },
  {
    icon: Plane,
    title: "Airport Transfers",
    description: "Seamless pickup and drop-off, no logistics to worry about.",
  },
];

export default function NewPackagesDialog() {
  const { open, setOpen } = useNewPackagesDialogStore();
  useEffect(() => {
    setOpen(true);
  }, [setOpen]);
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  // Lock scroll while open
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 shadow-[0_0_80px_rgba(34,211,238,.15)]">
        {/* Aurora */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-16 left-1/4 h-52 w-96 rounded-full bg-cyan-400 blur-3xl animate-pulse" />
          <div
            className="absolute top-10 right-0 h-52 w-96 rounded-full bg-emerald-400 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close dialog"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="relative max-h-[85vh] overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
          {/* Title */}
          <h2
            id="new-packages-title"
            className="mt-4 flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl"
          >
            <Sparkles className="h-6 w-6 shrink-0 text-emerald-300" />
            Lapland Tour Packages Are Here
          </h2>

          <p className="mt-3 max-w-lg text-sm text-slate-300 sm:text-base">
            Explore the Arctic like never before. Unforgettable adventures await
            — from <span className="font-bold text-white">€600/person</span>,
            with accommodation, activities, and airport transfers all included.
          </p>

          {/* Highlights grid */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-xl border border-cyan-400/10 bg-white/[0.03] p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{title}</h3>
                  <p className="mt-0.5 text-xs text-slate-400">{description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              Maybe later
            </button>

            <Link
              href="/packages"
              onClick={() => setOpen(false)}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 text-sm font-bold text-slate-900 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(34,211,238,.45)]"
            >
              Explore Packages
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
