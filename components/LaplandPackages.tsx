"use client";

import {
  Plane,
  Car,
  Coffee,
  Home,
  Shirt,
  Users,
  Check,
  MessageCircle,
  TreePine,
  Dog,
  Ship,
  UtensilsCrossed,
  Sparkles,
  Compass,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

/**
 * ---- DATA -------------------------------------------------------------
 */

type DayItem = { day: string; label: string };

type Package = {
  id: string;
  name: string;
  duration: string;
  price: number;

  itinerary: DayItem[];
  popular?: boolean;
};

const PACKAGES: Package[] = [
  {
    id: "classic",
    name: "Lapland Classic",
    duration: "4 DAYS / 3 NIGHTS",
    price: 600,
    itinerary: [
      { day: "Day 1", label: "Santa Claus Village & Snowman World" },
      {
        day: "Day 2",
        label: "Husky Safari, Reindeer Experience & Arctic SnowHotel",
      },
      { day: "Day 3", label: "Snowmobile Adventure & Northern Lights Tour" },
      { day: "Day 4", label: "Rovaniemi City Tour & Shopping" },
    ],
  },
  {
    id: "dream",
    name: "Lapland Dream",
    duration: "6 DAYS / 5 NIGHTS",
    price: 980,
    itinerary: [
      { day: "Day 1", label: "Santa Claus Village & Snowman World" },
      {
        day: "Day 2",
        label: "Husky Safari, Reindeer Experience & Arctic SnowHotel",
      },
      { day: "Day 3", label: "Snowmobile Adventure & Northern Lights Tour" },
      { day: "Day 4", label: "Rovaniemi City Tour & Shopping" },
      { day: "Day 5", label: "Finnish Horse Riding Experience" },
      { day: "Day 6", label: "Ranua Wildlife Park" },
    ],
  },
  {
    id: "ultimate",
    name: "Full Lapland Experience",
    duration: "8 DAYS / 7 NIGHTS",
    price: 1490,
    popular: true,
    itinerary: [
      { day: "Day 1", label: "Santa Claus Village & Snowman World" },
      {
        day: "Day 2",
        label: "Husky Safari, Reindeer Experience & Arctic SnowHotel",
      },
      { day: "Day 3", label: "Snowmobile Adventure & Northern Lights Tour" },
      { day: "Day 4", label: "Rovaniemi City Tour & Shopping" },
      { day: "Day 5", label: "Finnish Horse Riding Experience" },
      { day: "Day 6", label: "Ranua Wildlife Park" },
      { day: "Day 7", label: "Korouoma Frozen Waterfalls Tour" },
      { day: "Day 8", label: "Icebreaker Cruise Experience" },
    ],
  },
  {
    id: "luxury",
    name: "Arctic Luxury Experience",
    duration: "9 DAYS / 8 NIGHTS",
    price: 1790,
    itinerary: [
      {
        day: "Days 1–8",
        label: "All activities from the Ultimate Lapland Experience",
      },
      { day: "Added", label: "Icebreaker Cruise Experience" },
      { day: "Added", label: "Dinner at the Arctic SnowHotel Ice Restaurant" },
    ],
  },
  {
    id: "vip",
    name: "Complete Lapland VIP Experience",
    duration: "10 DAYS / 9 NIGHTS",
    price: 2190,
    itinerary: [
      {
        day: "Days 1–9",
        label: "All activities from the Arctic Luxury Experience",
      },
      { day: "Added", label: "1 Night in a Glass Igloo" },
      { day: "Added", label: "Dinner at the Arctic SnowHotel Ice Restaurant" },
      { day: "Added", label: "Luxury accommodation throughout" },
      {
        day: "Added",
        label: "Private VIP airport transfers & private transport",
      },
    ],
  },
];

const INCLUDED = [
  { icon: Plane, label: "Airport transfers" },
  { icon: Home, label: "Accommodation with breakfast" },
  { icon: Users, label: "English-speaking guide" },
  { icon: Car, label: "Transport during activities" },
  { icon: Shirt, label: "Winter clothing, when required" },
  { icon: Coffee, label: "Hot drinks & snacks" },
];

/** Shared card shell so every tile in the grid — pricing or CTA — is identical in height. */
const CARD_HEIGHT = "h-[620px]";

function PricingCard({ pkg }: { pkg: Package }) {
  return (
    <div
      className={`relative flex ${CARD_HEIGHT} flex-col rounded-2xl border p-6 backdrop-blur-md ${
        pkg.popular
          ? "border-[#E8A94A]/60 bg-white/10 shadow-[0_0_0_1px_rgba(232,169,74,0.25),0_20px_50px_-15px_rgba(232,169,74,0.35)]"
          : "border-white/15 bg-white/[0.06]"
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
        <span className="mt-1.5 inline-block rounded-full bg-[#E8A94A]/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#E8A94A]">
          {pkg.duration}
        </span>
      </div>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-sm text-[#9FB2CB]">From</span>
        <span className="text-4xl font-bold text-white">
          €{pkg.price.toLocaleString()}
        </span>
        <span className="text-sm text-[#9FB2CB]">/ person</span>
      </div>

      <ul className="mt-5 flex-1 space-y-2.5 overflow-hidden">
        {pkg.itinerary.map((d, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#D7E1EE]">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-[#6FE3E8]"
              strokeWidth={2}
            />
            <span>{d.label}</span>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
        <div className="flex flex-col items-center gap-1">
          <Plane className="h-4 w-4 text-[#6FE3E8]" strokeWidth={1.75} />
          <span className="text-[10px] leading-tight text-[#9FB2CB]">
            Airport
            <br />
            Transfers
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Home className="h-4 w-4 text-[#6FE3E8]" strokeWidth={1.75} />
          <span className="text-[10px] leading-tight text-[#9FB2CB]">
            1 Night in
            <br />
            Glass Igloo
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Coffee className="h-4 w-4 text-[#6FE3E8]" strokeWidth={1.75} />
          <span className="text-[10px] leading-tight text-[#9FB2CB]">
            Hot Drinks
            <br />& Snacks
          </span>
        </div>
      </div>

      <button
        className={`w-full rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer mt-5 ${
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

/** The 6th tile: not a priced package, an invitation to build a custom trip. */
function CustomizeCard() {
  return (
    <div
      className={`relative flex ${CARD_HEIGHT} flex-col items-center justify-center rounded-2xl border border-dashed border-[#E8A94A]/50 bg-white/[0.04] p-6 text-center backdrop-blur-md`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
        <Compass className="h-5 w-5 text-[#E8A94A]" strokeWidth={1.75} />
      </div>
      <h3 className="font-display mt-4 text-lg font-semibold text-white">
        Customize your experience
      </h3>
      <p className="mt-3 text-sm text-[#9FB2CB]">
        Have different dates, a bigger group, or activities you'd like to mix
        and match? Tell us what you have in mind and we'll build a private
        itinerary just for you.
      </p>
      <Link href="/contact" className="mt-6 w-full">
        <button className="flex w-full items-center justify-center gap-2 rounded-full border border-[#E8A94A] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#E8A94A] transition-colors duration-200 hover:bg-[#E8A94A] hover:text-[#0A1626] cursor-pointer">
          <MessageCircle className="h-4 w-4" />
          Talk to us
        </button>
      </Link>
    </div>
  );
}

export default function LaplandPackages() {
  return (
    <section className="relative overflow-hidden py-20 bg-slate-900 ">
      <style>{`
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .aurora-band {
          position: absolute;
          left: -10%;
          width: 120%;
          filter: blur(40px);
          opacity: 0.55;
          mix-blend-mode: screen;
          animation: aurora-drift 16s ease-in-out infinite;
        }
        .aurora-band--a {
          top: -5%;
          height: 220px;
          background: linear-gradient(90deg, transparent, #2fbf8f, #6fe3e8, transparent);
          animation-duration: 18s;
        }
        .aurora-band--b {
          top: 12%;
          height: 180px;
          background: linear-gradient(90deg, transparent, #3fd6a6, transparent);
          animation-duration: 22s;
          animation-delay: -6s;
        }
        .aurora-band--c {
          top: 25%;
          height: 140px;
          background: linear-gradient(90deg, transparent, #9b7ee8, #6fe3e8, transparent);
          opacity: 0.35;
          animation-duration: 26s;
          animation-delay: -3s;
        }
        @keyframes aurora-drift {
          0% { transform: translateX(-4%) translateY(0); }
          50% { transform: translateX(4%) translateY(10px); }
          100% { transform: translateX(-4%) translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-band { animation: none; }
        }
      `}</style>

      <div className="relative mx-auto max-w-6xl px-4 mt-14">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#6FE3E8]">
            Our Lapland Packages
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
            Choose your Arctic journey
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#9FB2CB]">
            Every package below is a complete, ready-to-go itinerary — pick the
            length that fits your trip and we'll handle the rest.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <PricingCard key={pkg.id} pkg={pkg} />
          ))}
          <CustomizeCard />
        </div>

        <div className="mt-14 rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-md">
          <h3 className="font-display text-lg font-semibold text-white">
            Every package includes
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-[#D7E1EE]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon className="h-4 w-4 text-[#6FE3E8]" strokeWidth={1.75} />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
