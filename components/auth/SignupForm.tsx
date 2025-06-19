"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    signUpSchema,
    TSignUpSchema,
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
import { Eye, EyeOff, Lock, Mail, User2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/api/auth";
import LoadingButton from "../loaders/LoadingButton";
import { useAuthDialogsStore } from "@/store/zustand/store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { showSuccessToast } from "@/lib/toasts/toasts";
import { Button } from "../ui/button";

export function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailCode, setEmailCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const { isSignupOpen, setIsSignUpOpen, setIsSignInOpen } =
        useAuthDialogsStore();

    const form = useForm<TSignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        },
    });
    const {
        mutate: sendVerifMail,
        isPending: isSendingMail,
        isError,
        error,
        isSuccess,
    } = useMutation({
        mutationFn: async (email: string) => {
            const response = await fetch(
                "http://localhost:3000/api/auth/sendCode",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                },
            );
            if (!response.ok) {
                throw new Error("Failed to send verification code");
            }
            return response.json();
        },
        onSuccess: () => {
            setEmailSent(true);
            setIsVerifying(false);
        },
        onError: () => {
            setIsVerifying(false);
        },
    });

    const sendMail = () => {
        const email = form.getValues("email");
        console.log("Sending verification email to:", email);
        if (!email) {
            // Optional: Show some error on UI that email is required before sending
            return;
        }
        setIsVerifying(true);
        sendVerifMail(email);
    };
    const { mutate: createUser, isPending } = useMutation({
        mutationFn: authService.signUp,
        onSuccess: () => {
            showSuccessToast("Signed up successfully");
            setIsSignUpOpen(false);
            setIsSignInOpen(true);
            form.reset();
        },
        onError: (error: { message: string }) => {
            if (error.message === "User with this email already exists") {
                // Set error on the email field
                form.setError("email", {
                    type: "manual",
                    message: error.message,
                });
            } else {
                form.setError("root", {
                    type: "manual",
                    message:
                        "Make sure you are connected to the internet and try again , if the issue remain try contacting the dev team",
                });
            }
        },
    });
    const onSubmit = form.handleSubmit((data) => {
        createUser(data);
    });
    const handleOpenChange = () => {
        setIsSignUpOpen(!isSignupOpen);
    };
    const openSignIn = () => {
        setIsSignUpOpen(false);
        setIsSignInOpen(true);
    };
    return (
        <Dialog onOpenChange={handleOpenChange} open={isSignupOpen}>
            <DialogTitle></DialogTitle>
            <DialogContent>
                <DialogHeader>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="mx-auto w-full max-w-lg space-y-6  p-10 rounded-lg">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold font-heading">
                            Create an account
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your details to get started
                        </p>
                    </div>

                    {/* Display root-level errors */}
                    {form.formState.errors.root && (
                        <p className="text-sm font-medium text-white text-center bg-destructive py-1 rounded p-5">
                            {form.formState.errors.root.message}
                        </p>
                    )}

                    <Form {...form}>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Full name
                                        </FormLabel>
                                        <div className="relative">
                                            <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter your full name"
                                                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Email address
                                        </FormLabel>
                                        <div className="relative flex space-x-2">
                                            <div className="relative w-full">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        className="pl-10 h-12 border-gray-300"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <Button
                                                className="py-[1.35rem] focus:ring-0"
                                                type="button"
                                                variant="outline"
                                                onClick={sendMail}
                                            >
                                                {isVerifying
                                                    ? "Sending..."
                                                    : "Verify"}
                                            </Button>
                                        </div>

                                        {emailSent && (
                                            <div className="mt-3 space-y-2">
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Enter verification code
                                                </FormLabel>
                                                <Input
                                                    placeholder="6-digit code"
                                                    maxLength={6}
                                                    value={emailCode}
                                                    onChange={(e) =>
                                                        setEmailCode(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <Button
                                                    variant="secondary"
                                                    onClick={async () => {
                                                        try {
                                                            // Call your verify API here and await response
                                                            // If success:
                                                            setIsEmailVerified(
                                                                true,
                                                            );
                                                            showSuccessToast(
                                                                "Email verified!",
                                                            );
                                                            // else throw to catch block for error display
                                                        } catch {
                                                            form.setError(
                                                                "email",
                                                                {
                                                                    type: "manual",
                                                                    message:
                                                                        "Incorrect code. Try again.",
                                                                },
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Confirm Code
                                                </Button>
                                            </div>
                                        )}

                                        {isEmailVerified && (
                                            <p className="text-sm text-green-600">
                                                Email successfully verified ✅
                                            </p>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <LoadingButton loading={isPending}>
                                Create account
                            </LoadingButton>
                        </form>
                    </Form>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <button
                            onClick={openSignIn}
                            className="text-primary font-medium hover:underline cursor-pointer"
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
