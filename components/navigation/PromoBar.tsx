"use client";

import { Link } from "@/i18n/navigation";
import { usePromobarStore } from "@/store/zustand/promoBar";
import { ArrowRight, Sparkles, Mountain, Plane, X } from "lucide-react";
import { useEffect, useRef } from "react";

export default function PromoBar() {
  const { openPromobar, setOpenPromoBar } = usePromobarStore();
  const navRef = useRef<HTMLElement>(null);

  // Keep --promobar-height in sync with the real rendered height,
  // at every breakpoint, instead of hardcoding offsets elsewhere.
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--promobar-height",
        `${el.offsetHeight}px`,
      );
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(el);
    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [openPromobar]);

  return (
    <nav
      ref={navRef}
      className={`${openPromobar ? "block" : "hidden"} fixed top-0 left-0 w-full z-[60] overflow-hidden border-b border-cyan-400/20 bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-950`}
    >
      {/* Aurora */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-12 left-1/4 h-40 w-80 rounded-full bg-cyan-400 blur-3xl animate-pulse" />
        <div
          className="absolute top-6 right-1/3 h-40 w-80 rounded-full bg-emerald-400 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Close button — always top-right, reachable at every size */}
      <button
        onClick={() => setOpenPromoBar(false)}
        aria-label="Close promo banner"
        className="absolute right-3 top-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-4 sm:top-1/2 sm:-translate-y-1/2"
      >
        <X size={18} />
      </button>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 pr-12 sm:px-6 sm:py-4 sm:pr-16 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        {/* Copy */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-white sm:text-xl">
              Discover our new Lapland Packages
            </h3>

            {/* Full details on tablet/desktop */}
            <div className="hidden items-center text-sm text-slate-300 md:flex">
              <Mountain className="mr-1 inline h-4 w-4 shrink-0 text-cyan-300" />
              Multi-day adventures from
              <span className="mx-1 font-bold text-white">€600/person</span>
              <span className="mx-2 text-cyan-400">•</span>
              Accommodation
              <span className="mx-2 text-cyan-400">•</span>
              Activities
              <span className="mx-2 text-cyan-400">•</span>
              <Plane className="ml-2 mr-1 inline h-4 w-4 shrink-0 text-cyan-300" />
              Airport Transfers
            </div>

            {/* Condensed details on mobile */}
            <p className="truncate text-xs text-slate-300 md:hidden">
              From <span className="font-bold text-white">€600/person</span> ·
              Accommodation & Activities
            </p>
          </div>
        </div>

        {/* CTA — arrow + label make it obvious it's clickable */}
        <Link
          href="/packages"
          className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-900 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(34,211,238,.45)] sm:px-7 sm:py-3"
        >
          Explore Packages
          <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
        </Link>
      </div>
    </nav>
  );
}
