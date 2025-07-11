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
export const activityFormSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be less than 100 characters"),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters"),
    shortDescription: z
        .string()
        .min(5, "Short description must be at least 5 characters")
        .max(200, "Short description must be less than 200 characters"),
    duration: z.string().min(1, "Duration is required"),
    adultPrice: z.number().min(0, "Adult price must be positive"),
    childPrice: z.number().min(0, "Child price must be positive").optional(),
    tags: z.array(z.string()).min(1, "Select at least one tag"),
});

export type ActivityFormValues = z.infer<typeof activityFormSchema>;
