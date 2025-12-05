// src/types/prisma.ts

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  bookings?: Booking[];
}

export interface EmailVerification {
  id: string;
  email: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface Activity {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  cancellationPolicy?: string;
  included: string[];
  difficulty: ActivityDifficulty;
  bring?: string;
  tags: string[];
  duration: string;
  meetingPoints: string[];
  bookingCutoffHours?: number;
  liveTourGuide: boolean;
  location: string;
  adultPrice: number;
  childPrice?: number;
  privateTourPrice: number;
  isForChild: boolean;

  imageUrl: string;
  imageKey: string;
  startDate: Date;
  endDate: Date;
  departureHours: string[];
  createdAt: Date;
  updatedAt: Date;
  booking?: Booking[];
}

export interface Booking {
  id: string;
  activityId: string;
  date: Date;
  adults: number;
  children: number;
  infants: number;
  totalPrice: number;
  bookingRef: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: Booking_Status;
  departureHour: string;
  pickUpLocation: string;
  dropOffLocation: string;
  isPrivate: boolean;
  createdAt: Date;

  userId?: string;
  activity?: Activity;
  user?: User;
}

export interface Emails {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  keywords: string[];
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

export enum ActivityDifficulty {
  EASY = "EASY",
  MODERATE = "MODERATE",
  HARD = "HARD",
  EXTREME = "EXTREME",
}

export enum Booking_Status {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}
