import type { BookingWithActivity } from "@/types/activityWithBooking";

export type Booking = BookingWithActivity;

export const fullName = (b: Booking) => `${b.firstName} ${b.lastName}`.trim();

export const guestsTotal = (b: Booking) => b.adults + b.children + b.infants;

// Dates can be Date objects (server props) or ISO strings (after a refresh).
export const asDate = (value: Date | string) => new Date(value);

export function isUpcoming(b: Booking) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return asDate(b.date).getTime() >= today.getTime();
}

export const NO_DROP_OFF = "I don't need drop off";