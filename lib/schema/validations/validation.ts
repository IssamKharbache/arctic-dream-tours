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

// Enhanced schema to match your Prisma model
export const activityFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    shortDescription: z.string().min(1, "Short description is required"),
    location: z.string().min(1, "Location is required"),
    duration: z.string().min(1, "Duration is required"),
    adultPrice: z.number().min(0, "Adult price must be positive"),
    childPrice: z.number().min(0, "Child price must be positive"), // Updated
    tags: z.array(z.string()).min(1, "At least one tag is required"),
    difficulty: z.enum(["EASY", "MODERATE", "HARD", "EXTREME"]),
    seasonType: z.enum(["SUMMER", "WINTER"]),
    cancellationPolicy: z.string().optional(),
    bring: z.string().optional(),
    included: z
        .array(
            z.object({
                value: z.string().min(1, "Item cannot be empty"),
            }),
        )
        .min(1, "At least one included item is required"),
    meetingPoints: z
        .array(
            z.object({
                value: z.string().min(1, "Meeting point cannot be empty"),
            }),
        )
        .min(1, "At least one meeting point is required"),
    bookingCutoffHours: z.number().min(1).optional().or(z.literal(0)), // Updated
    liveTourGuide: z.boolean(),
});

export type ActivityFormValues = z.infer<typeof activityFormSchema>;
