import { TSignUpSchema } from "../schema/validations/validation";

export const authService = {
    signUp: async (data: TSignUpSchema) => {
        const { email, fullName, password } = data;
        const response = await fetch("/api/user/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.trim().toLowerCase(),
                fullName,
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
