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
