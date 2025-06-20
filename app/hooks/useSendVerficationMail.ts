import { useMutation } from "@tanstack/react-query";

export const useSendVerificationMail = (
    onSuccess: () => void,
    onError: () => void,
) => {
    return useMutation({
        mutationFn: async (email: string) => {
            const res = await fetch("/api/auth/sendCode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) throw new Error("Failed to send verification code");
            return res.json();
        },
        onSuccess,
        onError,
    });
};
