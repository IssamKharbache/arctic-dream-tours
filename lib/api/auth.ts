import { TSignUpSchema } from "../schema/validations/validation";

export const authService = {
    signUp: async (data: TSignUpSchema) => {
        const { email, firstName, lastName, password } = data;
        const response = await fetch("/api/user/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.trim().toLowerCase(),
                firstName,
                lastName,
                password,
                role: "USER",
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Sign up failed");
        }

        return await response.json();
    },
};
