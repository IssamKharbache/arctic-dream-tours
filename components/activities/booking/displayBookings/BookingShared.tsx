import type { ReactNode } from "react";
import Image from "next/image";
import { CreditCard, Mail, Phone, Users } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Status pill                                                               */
/* -------------------------------------------------------------------------- */

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  CONFIRMED: {
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  PENDING: {
    pill: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  CANCELLED: {
    pill: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
  },
};

const DEFAULT_STATUS = {
  pill: "bg-stone-50 text-stone-700 ring-stone-200",
  dot: "bg-stone-400",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? DEFAULT_STATUS;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset shadow-sm",
        style.pill
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {status}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

export function InfoTile({
  icon,
  label,
  children,
  className,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-start gap-3 rounded-xl bg-stone-50 p-3 ring-1 ring-inset ring-stone-200/70",
        className
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600 shadow-sm ring-1 ring-stone-200">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
          {label}
        </p>
        <div className="mt-0.5 break-words text-sm font-medium text-stone-800">
          {children}
        </div>
      </div>
    </div>
  );
}

export function formatParticipants({
  adults,
  children,
  infants,
}: {
  adults: number;
  children: number;
  infants: number;
}) {
  const parts: string[] = [];
  if (adults > 0) parts.push(`${adults} Adult${adults !== 1 ? "s" : ""}`);
  if (children > 0)
    parts.push(`${children} Child${children !== 1 ? "ren" : ""}`);
  if (infants > 0) parts.push(`${infants} Infant${infants !== 1 ? "s" : ""}`);
  return parts;
}

export function ParticipantsTile(props: {
  adults: number;
  children: number;
  infants: number;
}) {
  const parts = formatParticipants(props);

  return (
    <InfoTile icon={<Users className="h-4 w-4" />} label="Participants">
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {parts.map((part) => (
          <span key={part}>{part}</span>
        ))}
      </div>
    </InfoTile>
  );
}

export function ContactTiles({
  email,
  phone,
}: {
  email: string;
  phone: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <InfoTile icon={<Mail className="h-4 w-4" />} label="Email">
        {email}
      </InfoTile>
      <InfoTile icon={<Phone className="h-4 w-4" />} label="Phone">
        {phone}
      </InfoTile>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shell shared by both cards                                                */
/* -------------------------------------------------------------------------- */

interface BookingShellProps {
  imageUrl?: string | null;
  imageAlt: string;
  fallbackIcon?: ReactNode;
  status: string;
  typeLabel?: string;
  title: string;
  subtitle?: ReactNode;
  bookingRef: string;
  totalLabel: string;
  total: number;
  totalExtra?: ReactNode;
  children: ReactNode;
}

export function BookingShell({
  imageUrl,
  imageAlt,
  fallbackIcon,
  status,
  typeLabel,
  title,
  subtitle,
  bookingRef,
  totalLabel,
  total,
  totalExtra,
  children,
}: BookingShellProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="md:flex">
        {/* Visual side */}
        <div className="relative h-56 md:h-auto md:min-h-full md:w-72 md:shrink-0">
         
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200 text-amber-600">
              {fallbackIcon}
            </div>
        
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-stone-900/10" />

          <div className="absolute left-4 top-4">
            <StatusBadge status={status} />
          </div>

          {typeLabel && (
            <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-800 shadow-sm backdrop-blur">
              {typeLabel}
            </span>
          )}
        </div>

        {/* Content side */}
        <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-xl font-bold tracking-tight text-stone-900">
                {title}
              </h3>
              {subtitle && (
                <div className="mt-1 text-sm text-stone-600">{subtitle}</div>
              )}
            </div>

            <div className="shrink-0 rounded-lg border border-dashed border-stone-300 bg-stone-50 px-3 py-2 sm:text-right">
              <p className="text-[10px] font-medium uppercase tracking-widest text-stone-500">
                Booking Ref
              </p>
              <p className="font-mono text-sm font-semibold text-stone-800">
                {bookingRef}
              </p>
            </div>
          </header>

          <div className="mt-5 space-y-4">{children}</div>

          {/* Ticket-style footer */}
          <footer className="mt-6 flex items-end justify-between gap-4 border-t border-dashed border-stone-300 pt-4">
            <div className="flex items-center gap-2 text-stone-500">
              <CreditCard className="h-4 w-4" />
              <span className="text-sm">{totalLabel}</span>
            </div>

            <div className="text-right">
              <p className="text-2xl font-extrabold tracking-tight text-stone-900">
                €{total.toFixed(2)}
              </p>
              {totalExtra}
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}