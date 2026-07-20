"use client";

import { ArrowRight, Sparkles, Mountain, Plane } from "lucide-react";
import Link from "next/link";

export default function PromoBar() {
  return (
    <section className="relative overflow-hidden border-b border-cyan-400/20 bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-950">
      {/* Aurora */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-12 left-1/4 h-40 w-80 rounded-full bg-cyan-400 blur-3xl animate-pulse" />
        <div
          className="absolute top-6 right-1/3 h-40 w-80 rounded-full bg-emerald-400 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-5 lg:flex-row">
        {/* Left */}

        <div className="flex flex-col items-center gap-3 text-center lg:flex-row lg:text-left">
          <div className="flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-cyan-300 animate-pulse" />

            <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-sm font-bold uppercase tracking-wider text-transparent">
              NEW 2026
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">
              Discover our new Lapland Packages
            </h3>

            <p className="mt-1 text-sm text-slate-300">
              <Mountain className="mr-1 inline h-4 w-4 text-cyan-300" />
              Multi-day adventures from
              <span className="mx-1 font-bold text-white">€600/person</span>
              <span className="mx-2 text-cyan-400">•</span>
              Accommodation
              <span className="mx-2 text-cyan-400">•</span>
              Activities
              <span className="mx-2 text-cyan-400">•</span>
              <Plane className="mr-1 ml-2 inline h-4 w-4 text-cyan-300" />
              Airport Transfers
            </p>
          </div>
        </div>

        {/* CTA */}

        <Link
          href="/packages"
          className="
          group
          inline-flex
          items-center
          gap-2
          rounded-full
          bg-gradient-to-r
          from-cyan-400
          to-emerald-400
          px-7
          py-3
          text-sm
          font-bold
          text-slate-900
          transition-all
          duration-300
          hover:scale-105
          hover:shadow-[0_0_40px_rgba(34,211,238,.45)]
        "
        >
          Explore Packages
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
