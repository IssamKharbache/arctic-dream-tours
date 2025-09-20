import { Booking, Activity } from "@prisma/client";

export type BookingWithActivity = Booking & {
  activity: Activity;
};
