"use client";

import { Link, usePathname } from "@/i18n/navigation";
import Image from "next/image";
import { useNewPackagesDialogStore } from "@/store/zustand/NewPackagesDialog";
import {
  X,
  Mountain,
  Sparkles,
  ArrowRight,
  CalendarDays,
  Users,
  CheckCircle2,
  Gift,
} from "lucide-react";
import { useEffect, useState } from "react";

const SHOW_DELAY_MS = 800;

const FEATURES = [
  {
    icon: Mountain,
    title: "Choose your adventures",
    description:
      "Build your own itinerary by selecting the activities you want to experience.",
  },
  {
    icon: CalendarDays,
    title: "Pick your dates",
    description:
      "Choose dates for your selected activities and plan your Arctic getaway.",
  },
  {
    icon: Users,
    title: "Travel your way",
    description:
      "Add adults, children, and infants to calculate your booking price.",
  },
];

export default function NewPackagesDialog() {
  const { open, setOpen } = useNewPackagesDialogStore();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isHome) {
      setOpen(false);
      return;
    }

    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isHome, setOpen]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!mounted || !isHome || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-packages-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 cursor-default bg-slate-950/85 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Dialog */}
      <div className="relative isolate w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-300/20 shadow-[0_0_100px_rgba(34,211,238,.18)]">
        <Image
          src="/aurora.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 672px) 100vw, 672px"
          className="-z-20 object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/90 via-slate-950/80 to-slate-950/95" />

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close dialog"
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="relative max-h-[90dvh] overflow-y-auto px-5 py-7 sm:px-9 sm:py-9">
          {/* Eyebrow */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-200">
              <Sparkles size={14} />
              A new way to explore Lapland
            </span>
          </div>

          {/* Main message */}
          <h2
            id="new-packages-title"
            className="mt-5 max-w-xl text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-4xl"
          >
            Your Lapland adventure.
            <span className="block text-emerald-300">
              Your way.
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-200 sm:text-base sm:leading-7">
            From husky safaris and Northern Lights to unforgettable Arctic
            experiences, create a trip that feels like yours. Choose your
            activities, select your dates, and personalize your booking.
          </p>

          {/* Feature list */}
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-sm"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                  <Icon size={19} />
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-5 text-slate-300">
                  {description}
                </p>
              </div>
            ))}
          </div>

          {/* Bonus feature */}
          <div className="mt-4 flex gap-3 rounded-xl border border-amber-300/20 bg-amber-300/[0.07] p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200">
              <Gift size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Discover bonus activities
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                Look out for bonus experiences available with your package
                selection.
              </p>
            </div>
          </div>

          {/* Reassurance */}
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-300" />
              Secure online payment
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-300" />
              Clear activity pricing
            </span>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Maybe later
            </button>

            <Link
              href="/packages"
              onClick={() => setOpen(false)}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-6 py-3.5 text-sm font-bold text-slate-950 transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(34,211,238,.25)]"
            >
              <Mountain size={18} />
              Build Your Adventure
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
