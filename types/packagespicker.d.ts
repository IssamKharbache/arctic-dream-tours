import type { Package } from "@/app/data/laplandPackages";
import type { BookingCustomerFormData } from "@/lib/schema/validations/validation";

export type Activity = {
  id: string;
  title: string;
  imageUrl?: string | null;
  location?: string | null;
  difficulty?: string | null;
  adultPrice: number;
  childPrice: number;
  isForChild: boolean;
  startDate: string;
  endDate: string;
  bookingCutoffHours?: number | null;
  departureHours?: string[];
};

export type MembersSelection = {
  adults: number;
  children: number;
  infants: number;
};

export type CustomerDetailsData = BookingCustomerFormData;

export type PackageStep = 1 | 2 | 3;

export type PackageSelection = {
  packageId: string;
  activities: {
    activityId: string;
    date: string;
    departureHour?: string;
  }[];
  bonusActivityIds: string[];
  total: number;
  members: MembersSelection;
  customer: CustomerDetailsData;
};

export type Picked = {
  id: string;
  date: Date;
  departureHour?: string;
};

export type LoadStatus = "loading" | "success" | "error";


export type CheckoutData = {
  bookingId: string;
  bookingRef: string;
  clientSecret: string;
};

export type StepProps = {
  pkg: Package;
  activities: Activity[];
  status: LoadStatus;
  onCancel: () => void;
  onNext: (checkout: CheckoutData) => void;
};