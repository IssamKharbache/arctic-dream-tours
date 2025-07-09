import { TSignUpSchema } from "../schema/validations/validation";

export const authService = {
    signUp: async (data: TSignUpSchema) => {
        const { email, firstName, lastName, password } = data;

        // Process values - removing ALL whitespace
        const processed = {
            email: removeAllWhitespace(email).toLowerCase(),
            firstName: removeAllWhitespace(firstName).toLowerCase(),
            lastName: removeAllWhitespace(lastName).toLowerCase(),
            password,
            role: "USER",
        };
        const response = await fetch("/api/user/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(processed),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Sign up failed");
        }

        return await response.json();
    },
};

// Helper function to remove ALL whitespace
const removeAllWhitespace = (str: string) => str.replace(/\s+/g, "");
