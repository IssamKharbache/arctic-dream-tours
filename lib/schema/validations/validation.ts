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

export const signInSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

export type TSignInSchema = z.infer<typeof signInSchema>;
