
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plane,
  Coffee,
  Check,
  Compass,
  ChevronLeft,
  ChevronRight,
  Gift,
} from "lucide-react";

import {
  INCLUDED,
  type Package,
  PACKAGES,
} from "@/app/data/laplandPackages";

import type {
  Activity,
  PackageSelection,
} from "@/types/packagespicker";

import PackagePickerDialog from "./activities/booking/activitiesPicker/PackagepickerDialog";

const baseUrl = process.env.NEXT_PUBLIC_URL ?? "";

async function fetchActivities(): Promise<Activity[]> {
  const res = await fetch(`${baseUrl}/api/activity/get-all`);

  if (!res.ok) {
    throw new Error("Failed to fetch activities.");
  }

  const data = await res.json();
  return data.data;
}

function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  useEffect(() => {
    let cancelled = false;

    fetchActivities()
      .then((data) => {
        if (cancelled) return;

        setActivities(Array.isArray(data) ? data : []);
        setStatus("success");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { activities, status };
}

function PricingCard({
  pkg,
  onSelect,
}: {
  pkg: Package;
  onSelect: (pkg: Package) => void;
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border p-6 backdrop-blur-md ${
        pkg.popular
          ? "border-[#E8A94A]/60 bg-white/10 shadow-[0_0_0_1px_rgba(232,169,74,0.25),0_20px_50px_-15px_rgba(232,169,74,0.35)]"
          : "border-white/15 bg-white/6"
      }`}
    >
      {pkg.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E8A94A] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0A1626]">
          Most booked
        </span>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-semibold leading-tight text-white">
          {pkg.name}
        </h3>

        <span className="mt-2 inline-block rounded-full bg-[#E8A94A]/15 px-3.5 py-1 text-sm font-semibold uppercase tracking-wide text-[#E8A94A]">
          {pkg.duration}
        </span>
      </div>

      <div className="mt-5 rounded-xl bg-white/6 px-4 py-3 text-center">
        <p className="text-3xl font-bold text-white">{pkg.pickCount}</p>
        <p className="text-sm text-[#D7E1EE]">
          activities of your choice
        </p>
        <p className="mt-1 text-xs text-[#9FB2CB]">
          Your price depends on the activities you pick
        </p>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-[#E8A94A]" strokeWidth={1.75} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E8A94A]">
            Free with this package
          </span>
        </div>

        <ul className="mt-3 space-y-2.5">
          {pkg.bonusActivities.map((bonus) => (
            <li
              key={bonus.id}
              className="flex items-start gap-2 text-sm text-[#D7E1EE]"
            >
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-[#6FE3E8]"
                strokeWidth={2}
              />
              <span>{bonus.title}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1" />

      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-center">
        <div className="flex flex-col items-center gap-1">
          <Plane className="h-4 w-4 text-[#6FE3E8]" strokeWidth={1.75} />
          <span className="text-[10px] leading-tight text-[#9FB2CB]">
            Airport
            <br />
            Transfers
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Coffee className="h-4 w-4 text-[#6FE3E8]" strokeWidth={1.75} />
          <span className="text-[10px] leading-tight text-[#9FB2CB]">
            Hot Drinks
            <br />
            & Snacks
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelect(pkg)}
        className={`mt-5 flex w-full cursor-pointer items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
          pkg.popular
            ? "bg-[#E8A94A] text-[#0A1626] hover:bg-[#F2BE6B]"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        Book this package
      </button>
    </div>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className="group relative h-40 w-56 shrink-0 snap-start overflow-hidden rounded-xl border border-white/10 bg-white/4 sm:h-44 sm:w-64">
      {activity.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={activity.imageUrl}
          alt={activity.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-white/4">
          <Compass
            className="h-6 w-6 text-[#6FE3E8]/60"
            strokeWidth={1.5}
          />
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-[#0A1626] via-[#0A1626]/10 to-transparent" />

      <p className="absolute inset-x-0 bottom-0 p-3 text-sm font-semibold leading-tight text-white">
        {activity.title}
      </p>
    </div>
  );
}

function ActivitySlider({ activities }: { activities: Activity[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;

    const amount =
      track.clientWidth * 0.8 * (direction === "left" ? -1 : 1);

    track.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      {activities.length > 2 && (
        <>
          <button
            type="button"
            aria-label="Scroll activities left"
            onClick={() => scrollByCard("left")}
            className="absolute -left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#0A1626]/80 text-white backdrop-blur-md transition-colors duration-200 hover:bg-[#0A1626] sm:flex"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>

          <button
            type="button"
            aria-label="Scroll activities right"
            onClick={() => scrollByCard("right")}
            className="absolute -right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#0A1626]/80 text-white backdrop-blur-md transition-colors duration-200 hover:bg-[#0A1626] sm:flex"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </>
      )}
    </div>
  );
}

export default function LaplandPackages() {
  const { activities, status } = useActivities();

  const [selectedPackage, setSelectedPackage] =
    useState<Package | null>(null);

  const handleContinue = (selection: PackageSelection) => {
    try {
      localStorage.setItem("packageSelection", JSON.stringify(selection));
    } catch {
      // Local storage may be unavailable.
    }

    console.log("Package selection:", selection);
  };

  return (
    <section
      className="relative mt-22 overflow-hidden bg-slate-900 py-20 md:mt-16"
      style={{ backgroundImage: "url('/packages/iglos.jpg')" }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/70 to-slate-950/90" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-5%] h-55 w-[120%] animate-[aurora-drift_18s_ease-in-out_infinite] bg-[linear-gradient(90deg,transparent,#2fbf8f,#6fe3e8,transparent)] opacity-55 blur-2xl mix-blend-screen" />

        <div className="absolute left-[-10%] top-[12%] h-45 w-[120%] animate-[aurora-drift_22s_ease-in-out_infinite] bg-[linear-gradient(90deg,transparent,#3fd6a6,transparent)] opacity-55 blur-2xl mix-blend-screen [animation-delay:-6s]" />

        <div className="absolute left-[-10%] top-[25%] h-35 w-[120%] animate-[aurora-drift_26s_ease-in-out_infinite] bg-[linear-gradient(90deg,transparent,#9b7ee8,#6fe3e8,transparent)] opacity-35 blur-2xl mix-blend-screen [animation-delay:-3s]" />
      </div>

      <div className="relative mx-auto mt-14 max-w-6xl px-4">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#6FE3E8]">
            Our Lapland Packages
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
            Choose your Arctic journey
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm text-[#9FB2CB]">
            Pick the length that fits your trip, choose the activities you
            love, and enjoy free bonus experiences on top. We&apos;ll handle
            the rest.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <PricingCard
              key={pkg.id}
              pkg={pkg}
              onSelect={setSelectedPackage}
            />
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-white/15 bg-white/6 p-6 backdrop-blur-md">
          <h3 className="font-display text-lg font-semibold text-white">
            Every package includes
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map(({ icon: Icon, label }, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl bg-white/4 px-4 py-3 text-sm text-[#D7E1EE]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon
                    className="h-4 w-4 text-[#6FE3E8]"
                    strokeWidth={1.75}
                  />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>

      </div>

      <PackagePickerDialog
        pkg={selectedPackage}
        activities={activities}
        status={status}
        onOpenChange={(open) => {
          if (!open) setSelectedPackage(null);
        }}
        onContinue={handleContinue}
      />
    </section>
  );
}
