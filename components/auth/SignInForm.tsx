"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeClosed, EyeOff, Lock, Mail } from "lucide-react";

import LoadingButton from "../loaders/LoadingButton";
import Link from "next/link";
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
import { Label } from "../ui/label";

const SignInForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [signInError, setSignError] = useState("");
    const { isSignInOpen, setIsSignInOpen, setIsSignUpOpen } =
        useAuthDialogsStore();

    const router = useRouter();

    const form = useForm<TSignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: TSignInSchema) => {
        setIsPending(true);
        const signInData = await signIn("credentials", {
            email: data.email.trim().toLowerCase(),
            password: data.password,
            redirect: false,
        });
        if (!signInData?.ok) {
            setSignError("");
            if (signInData?.status === 401) {
                setSignError("Your email or password are incorrect");
            } else {
                setSignError("Something went wrong , try again later");
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
                <div className="mx-auto w-full max-w-lg space-y-6  p-10 rounded-lg">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold font-heading">
                            Welcome back
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your informations to sign in
                        </p>
                    </div>
                    {signInError ? (
                        <p className="bg-red-500 text-white  text-center rounded py-1 font-semibold">
                            {signInError}
                        </p>
                    ) : (
                        ""
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
                                            Email address
                                        </FormLabel>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email"
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
                                            Password
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
                                                    placeholder="Enter your password"
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

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <Label
                                        htmlFor="remember-me"
                                        className="ml-2 text-sm text-gray-700"
                                    >
                                        Remember me
                                    </Label>
                                </div>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <LoadingButton
                                className="mt-12"
                                loading={isPending}
                            >
                                Sign in
                            </LoadingButton>
                        </form>
                    </Form>

                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <button
                            onClick={openSignUp}
                            className="text-primary font-medium hover:underline cursor-pointer"
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SignInForm;
