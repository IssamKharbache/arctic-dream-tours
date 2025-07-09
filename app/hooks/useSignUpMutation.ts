import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/api/auth";
import { showSuccessToast } from "@/lib/toasts/toasts";
import { useAuthDialogsStore } from "@/store/zustand/store";
import { UseFormReturn } from "react-hook-form";
import { TSignUpSchema } from "@/lib/schema/validations/validation";

export const useSignUpMutation = (
    form: UseFormReturn<TSignUpSchema>,
    v: (key: string) => string,
    options?: {
        onSuccessExtra?: () => void;
    },
) => {
    const { setIsSignUpOpen, setIsSignInOpen } = useAuthDialogsStore();

    return useMutation({
        mutationFn: authService.signUp,
        onSuccess: () => {
            showSuccessToast("Created succefully");
            setIsSignUpOpen(false);
            setIsSignInOpen(true);
            form.reset();
            if (options?.onSuccessExtra) options.onSuccessExtra();
        },
        onError: (error: { message: string }) => {
            if (error.message === "User with this email already exists") {
                form.setError("email", {
                    type: "manual",
                    message: v("userExists"),
                });
            } else {
                form.setError("root", {
                    type: "manual",
                    message:
                        "Make sure you are connected to the internet and try again.",
                });
            }
        },
    });
};
