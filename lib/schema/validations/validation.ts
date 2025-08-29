import { z } from "zod";

export const signUpSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().min(1, t("firstNameRequired")),
    lastName: z.string().min(1, t("lastNameRequired")),
    email: z.string().email(t("emailInvalid")),
    password: z.string().min(6, t("passwordMinLength")),
  });
// Infer the type from a schema instance:
export type TSignUpSchema = z.infer<ReturnType<typeof signUpSchema>>;
export const signInSchema = (v: (key: string) => string) =>
  z.object({
    email: z.string().email({
      message: v("emailInvalid"),
    }),
    password: z.string().min(1, {
      message: v("passwordRequired"),
    }),
    rememberMe: z.boolean().optional(), // Add this
  });

export type TSignInSchema = z.infer<ReturnType<typeof signInSchema>>;

//activity form validations

export const baseActivitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  location: z.string().min(1, "Location is required"),
  duration: z.string().min(1, "Duration is required"),
  adultPrice: z.number().min(0, "Adult price must be positive"),
  childPrice: z.number().min(0, "Child price must be positive"),
  privateTourPrice: z.number().min(0, "Child price must be positive"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  difficulty: z.enum(["EASY", "MODERATE", "HARD", "EXTREME"]),
  seasonType: z.enum(["SUMMER", "WINTER"]),
  cancellationPolicy: z.string().optional(),
  bring: z.string().optional(),
  included: z
    .array(
      z.object({
        value: z.string().min(1, "Item cannot be empty"),
      })
    )
    .min(1, "At least one included item is required"),
  meetingPoints: z
    .array(
      z.object({
        value: z.string().min(1, "Meeting point cannot be empty"),
      })
    )
    .min(1, "At least one meeting point is required"),
  bookingCutoffHours: z.number().min(1).optional().or(z.literal(0)),
  liveTourGuide: z.boolean(),
  startDate: z.coerce.date({
    required_error: "Start date is required",
  }),
  endDate: z.coerce.date({
    required_error: "End date is required",
  }),
  departureHours: z.array(
    z.object({ value: z.string().min(1, "Hour required") })
  ),
});
export const activityFormSchema = baseActivitySchema.refine(
  (data) => data.endDate > data.startDate,
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

export type ActivityFormValues = z.infer<typeof activityFormSchema>;

export const bookingSchema = z.object({
  activityId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/, {
    message: "Must be ISO date string format",
  }),
  adults: z.number().min(1).max(20),
  children: z.number().min(0).max(10),
  infants: z.number().min(0).max(10),
  bookingRef: z.string().min(1),
  departureHour: z.string().min(1),
  isPrivate: z.boolean().default(false),
});

export const customerDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(6, "Phone number must be at least 6 characters")
    .max(20, "Phone number is too long"),
  pickUpLocation: z.string().min(1, "Pick up location is required"),
  dropOffLocation: z.string().min(1, "Drop off location is required"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
export type BookingCustomerFormData = z.infer<typeof customerDetailsSchema>;
