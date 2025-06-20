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
import { Eye, EyeOff, Loader, Loader2, Lock, Mail, User2 } from "lucide-react";
import LoadingButton from "../loaders/LoadingButton";
import { useAuthDialogsStore } from "@/store/zustand/store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useSendVerificationMail } from "@/app/hooks/useSendVerficationMail";
import { useSignUpMutation } from "@/app/hooks/useSignUpMutation";

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

    const { mutate: sendVerifMail, isPending: isVerifyingPending } =
        useSendVerificationMail(
            () => {
                setEmailSent(true);
                setIsVerifying(false);
            },
            () => {
                setIsVerifying(false);
            },
        );

    const { mutate: createUser, isPending } = useSignUpMutation(form);

    const sendMail = () => {
        const email = form.getValues("email");
        if (!email) {
            form.setError("email", {
                type: "manual",
                message: "Email is required",
            });
            return;
        }
        form.clearErrors();
        setIsEmailVerified(false);
        setEmailSent(false);
        setIsVerifying(true);
        sendVerifMail(email);
    };

    const onSubmit = form.handleSubmit((data) => {
        if (!isEmailVerified) {
            form.setError("email", {
                type: "manual",
                message: "You must verify your email first",
            });
            return;
        }
        createUser(data);
        setEmailCode("");
        setIsEmailVerified(false);
        setEmailSent(false);
    });

    const handleOpenChange = () => setIsSignUpOpen(!isSignupOpen);
    const openSignIn = () => {
        setIsSignUpOpen(false);
        setIsSignInOpen(true);
    };

    const verifyCode = async () => {
        try {
            const res = await fetch(
                "http://localhost:3000/api/auth/verifyCode",
                {
                    method: "POST",
                    body: JSON.stringify({
                        email: form.getValues("email"),
                        code: emailCode,
                    }),
                },
            );
            if (res.ok) {
                setIsEmailVerified(true);
                form.clearErrors();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog onOpenChange={handleOpenChange} open={isSignupOpen}>
            <DialogTitle />
            <DialogContent>
                <DialogHeader>
                    <DialogDescription />
                </DialogHeader>
                <div className="mx-auto w-full max-w-lg space-y-6 p-10 rounded-lg">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold font-heading">
                            Create an account
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your details to get started
                        </p>
                    </div>

                    {form.formState.errors.root && (
                        <p className="text-sm font-medium text-white text-center bg-destructive py-1 rounded p-5">
                            {form.formState.errors.root.message}
                        </p>
                    )}

                    <Form {...form}>
                        <form onSubmit={onSubmit} className="space-y-4">
                            {/* Full Name */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full name</FormLabel>
                                        <div className="relative">
                                            <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your full name"
                                                    className="pl-10 h-12"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email address</FormLabel>
                                        <div className="relative flex space-x-2">
                                            <div className="relative w-full">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your email"
                                                        className="pl-10 h-12"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <Button
                                                className="py-[1.35rem]"
                                                type="button"
                                                variant="outline"
                                                onClick={sendMail}
                                            >
                                                {isVerifying ? (
                                                    <Loader2 className="animate-spin" />
                                                ) : (
                                                    "Verify"
                                                )}
                                            </Button>
                                        </div>

                                        {emailSent && (
                                            <>
                                                <p className="text-sm text-green-700">
                                                    Email sent. Check your inbox
                                                    or spam folder for the code.
                                                </p>
                                                <div className="mt-3 space-y-2">
                                                    <FormLabel>
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
                                                        type="button"
                                                        variant="secondary"
                                                        onClick={verifyCode}
                                                    >
                                                        {isVerifyingPending ? (
                                                            <>
                                                                <Loader2 className="animate-spin" />
                                                            </>
                                                        ) : (
                                                            "Confirm Code"
                                                        )}
                                                    </Button>
                                                </div>
                                            </>
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

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
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
                                                    className="pl-10 pr-10 h-12"
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
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
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
                            className="text-primary font-medium hover:underline"
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
