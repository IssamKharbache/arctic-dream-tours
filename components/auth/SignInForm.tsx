"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    signInSchema,
    TSignInSchema,
} from "@/lib/schema/validations/validation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import LoadingButton from "../loaders/LoadingButton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
} from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useAuthDialogsStore } from "@/store/zustand/store";
import { showSuccessToast } from "@/lib/toasts/toasts";
import { useTranslations } from "next-intl";

const SignInForm = () => {
    const t = useTranslations("signin.signin");
    const v = useTranslations("signin.validation");
    const e = useTranslations("signin.errors");
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [signInError, setSignError] = useState("");
    const { isSignInOpen, setIsSignInOpen, setIsSignUpOpen } =
        useAuthDialogsStore();

    const router = useRouter();

    const schema = signInSchema(v);

    const form = useForm<TSignInSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit: SubmitHandler<TSignInSchema> = async (data) => {
        console.log("Form submitted with rememberMe:", data.rememberMe);
        setIsPending(true);
        const signInData = await signIn("credentials", {
            email: data.email.trim().toLowerCase(),
            password: data.password,
            redirect: false,
            remember: data.rememberMe,
        });

        if (!signInData?.ok) {
            setSignError("");
            if (signInData?.status === 401) {
                setSignError(e("invalidCredentials"));
            } else {
                setSignError(e("genericError"));
            }
            setIsPending(false);
        } else {
            setIsSignInOpen(false);
            showSuccessToast("Signed in successfully");
            setIsPending(false);
            setSignError("");
            router.push("/");
        }
    };

    const handleOpenChange = () => {
        setIsSignInOpen(!isSignInOpen);
    };

    const openSignUp = () => {
        setIsSignUpOpen(true);
        setIsSignInOpen(false);
    };

    return (
        <Dialog open={isSignInOpen} onOpenChange={handleOpenChange}>
            <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <DialogContent>
                <div className="mx-auto w-full max-w-lg space-y-6 p-10 rounded-lg">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold font-heading">
                            {t("title")}
                        </h1>
                        <p className="text-muted-foreground">
                            {t("description")}
                        </p>
                    </div>

                    {signInError && (
                        <p className="bg-red-500 text-white text-center rounded py-1 font-semibold">
                            {signInError}
                        </p>
                    )}

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            {t("email")}
                                        </FormLabel>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder={t("email")}
                                                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            {t("password")}
                                        </FormLabel>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <FormControl>
                                                <Input
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder={t("password")}
                                                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center">
                                <FormField
                                    control={form.control}
                                    name="rememberMe"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <input
                                                    type="checkbox"
                                                    id="remember-me"
                                                    checked={field.value}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormLabel
                                                htmlFor="remember-me"
                                                className="!mt-0"
                                            >
                                                {t("rememberMe")}
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Submit Button */}
                            <LoadingButton
                                className="mt-12"
                                loading={isPending}
                            >
                                {t("signInButton")}
                            </LoadingButton>
                        </form>
                    </Form>

                    {/* Sign up link */}
                    <div className="text-center text-sm text-muted-foreground">
                        {t("noAccount")}{" "}
                        <button
                            onClick={openSignUp}
                            className="text-primary font-medium hover:underline cursor-pointer"
                        >
                            {t("signUp")}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SignInForm;
