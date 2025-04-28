import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

export type TSignUpSchema = z.infer<typeof signUpSchema>;
