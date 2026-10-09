"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plane,
  Coffee,
  Check,
  MessageCircle,
  Compass,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { INCLUDED, Package, PACKAGES } from "@/app/data/laplandPackages";

type Activity = {
  id: string | number;
  title: string;
  imageUrl?: string;
};

const baseUrl = process.env.NEXT_PUBLIC_URL ?? "";
async function fetchActivities(): Promise<Activity[]> {
  const res = await fetch(`${baseUrl}/api/activity/get-all`);
  const data = await res.json();
  return data.data;
}

// ---- WhatsApp booking helpers -------------------------------------------

const WHATSAPP_NUMBER = "358404121843";

// Single price per package (activities & transfers only, no hotel).
// Falls back to priceWithoutHotel if the data file still uses the old shape.
function getPackagePrice(pkg: Package): number {
  return (pkg.price ?? pkg.priceWithoutHotel) as number;
}

function buildWhatsAppMessage(pkg: Package) {
  const price = getPackagePrice(pkg);

  const itineraryText = pkg.itinerary
    .map((d) => `${d.day}: ${d.label}`)
    .join("\n");

  const lines = [
    "Hi! I'd like to book this package:",
    "",
    `${pkg.name}`,
    `${pkg.duration}`,
    `€${price.toLocaleString()} / person`,
    "",
    "Itinerary:",
    itineraryText,
    "",
    "Can you tell me more about availability and next steps?",
  ];

  return lines.join("\n");
}
//booking function for customizing expe
function getWhatsappLinkForMoreInfos() {
  const text = `Hi! I'd like to create a customized Arctic experience.

I'm interested in building my own itinerary by selecting the activities I'd like to include.

Could you provide more information about availability, pricing, and the next steps for booking?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
//booking function
function getWhatsAppLink(pkg: Package) {
  const message = buildWhatsAppMessage(pkg);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ---------------------------------------------------------------------------

const CARD_HEIGHT = "h-170";

function PricingCard({ pkg }: { pkg: Package }) {
  const displayPrice = getPackagePrice(pkg);

  return (
    <div
      className={`relative flex ${CARD_HEIGHT} flex-col rounded-2xl border p-6 backdrop-blur-md ${
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

      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-sm text-[#9FB2CB]">From</span>
        <span className="text-4xl font-bold text-white">
          €{displayPrice.toLocaleString()}
        </span>
        <span className="text-sm text-[#9FB2CB]">/ person</span>
      </div>

      {/* Free booking help note */}
      <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#6FE3E8]/25 bg-[#6FE3E8]/10 px-3 py-2.5">
        <BadgeCheck
          className="mt-0.5 h-4 w-4 shrink-0 text-[#6FE3E8]"
          strokeWidth={2}
        />
        <p className="text-xs leading-snug text-[#D7E1EE]">
          Book a package and we&apos;ll help you with your hotel booking{" "}
          <span className="font-semibold text-white">free of charge</span>.
        </p>
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

      <div
        className={`grid grid-cols-2 gap-2 border-t border-white/10 pt-2  text-center `}
      >
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
            <br />& Snacks
          </span>
        </div>
      </div>

      <a
        href={getWhatsAppLink(pkg)}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-5 flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
          pkg.popular
            ? "bg-[#E8A94A] text-[#0A1626] hover:bg-[#F2BE6B]"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        Book this package
      </a>
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
          <Compass className="h-6 w-6 text-[#6FE3E8]/60" strokeWidth={1.5} />
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
    const amount = track.clientWidth * 0.8 * (direction === "left" ? -1 : 1);
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
            className="absolute -left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0A1626]/80 text-white backdrop-blur-md transition-colors duration-200 hover:bg-[#0A1626] cursor-pointer sm:flex"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Scroll activities right"
            onClick={() => scrollByCard("right")}
            className="absolute -right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0A1626]/80 text-white backdrop-blur-md transition-colors duration-200 hover:bg-[#0A1626] cursor-pointer sm:flex"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </>
      )}
    </div>
  );
}

function CustomizeSection() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

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

  return (
    <div className="mt-14 rounded-2xl border border-dashed border-[#E8A94A]/50 bg-white/4 p-6 backdrop-blur-md md:p-8">
      {/* Pitch + CTA */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Compass className="h-5 w-5 text-[#E8A94A]" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-white">
              Build your own itinerary
            </h3>
            <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-[#9FB2CB]">
              Our packages are designed to be flexible. Pick your preferred
              package, choose the activities you love from our selection, and
              we&apos;ll tailor your itinerary into a unique experience just for
              you.
            </p>
          </div>
        </div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={getWhatsappLinkForMoreInfos()}
          className="w-full sm:w-auto"
        >
          <button className="flex w-full items-center justify-center gap-2 rounded-full border border-[#E8A94A] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#E8A94A] transition-colors duration-200 hover:bg-[#E8A94A] hover:text-[#0A1626] cursor-pointer sm:w-auto">
            <MessageCircle className="h-4 w-4" />
            Talk to us
          </button>
        </a>
      </div>

      {/* Activities slider */}
      <div className="mt-6 border-t border-white/10 pt-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#6FE3E8]" strokeWidth={1.75} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6FE3E8]">
            Activities you can choose from
          </span>
        </div>

        {status === "loading" && (
          <div className="mt-4 flex gap-3 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="h-40 w-56 shrink-0 animate-pulse rounded-xl bg-white/6 sm:h-44 sm:w-64"
              />
            ))}
          </div>
        )}

        {status === "error" && (
          <p className="mt-4 text-sm text-[#9FB2CB]">
            We couldn&apos;t load the full activity list right now — reach out
            and we&apos;ll walk you through every option.
          </p>
        )}

        {status === "success" && activities.length === 0 && (
          <p className="mt-4 text-sm text-[#9FB2CB]">
            Reach out and we&apos;ll walk you through every activity we offer.
          </p>
        )}

        {status === "success" && activities.length > 0 && (
          <div className="mt-4">
            <ActivitySlider activities={activities} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function LaplandPackages() {
  return (
    <section
      className="relative overflow-hidden py-20 mt-22 md:mt-16 bg-slate-900 "
      style={{ backgroundImage: "url('/packages/iglos.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/70 to-slate-950/90" />
      {/* Aurora */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
        absolute
        -left-[10%]
        -top-[5%]
        h-55
        w-[120%]
        bg-[linear-gradient(90deg,transparent,#2fbf8f,#6fe3e8,transparent)]
        opacity-55
        blur-2xl
        mix-blend-screen
        animate-[aurora-drift_18s_ease-in-out_infinite]
      "
        />

        <div
          className="
        absolute
        -left-[10%]
        top-[12%]
        h-45
        w-[120%]
        bg-[linear-gradient(90deg,transparent,#3fd6a6,transparent)]
        opacity-55
        blur-2xl
        mix-blend-screen
        animate-[aurora-drift_22s_ease-in-out_infinite]
        [animation-delay:-6s]
      "
        />

        <div
          className="
        absolute
        -left-[10%]
        top-[25%]
        h-35
        w-[120%]
        bg-[linear-gradient(90deg,transparent,#9b7ee8,#6fe3e8,transparent)]
        opacity-35
        blur-2xl
        mix-blend-screen
        animate-[aurora-drift_26s_ease-in-out_infinite]
        [animation-delay:-3s]
      "
        />
      </div>
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
            length that fits your trip and we&apos;ll handle the rest.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <PricingCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        <CustomizeSection />

        <div className="mt-14 rounded-2xl border border-white/15 bg-white/6 p-6 backdrop-blur-md">
          <h3 className="font-display text-lg font-semibold text-white">
            Every package includes
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-white/4 px-4 py-3 text-sm text-[#D7E1EE]"
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
