"use client";
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
import { Eye, EyeOff, Loader2, Lock, Mail, User2 } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

export function SignUpForm() {
    //states
    const [showPassword, setShowPassword] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailCode, setEmailCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isCodeVerifying, setIsCodeVerifying] = useState(false);
    const { isSignupOpen, setIsSignUpOpen, setIsSignInOpen } =
        useAuthDialogsStore();

    //getting translations
    const t = useTranslations("signup");
    const v = useTranslations("validation");
    // Use the factory function with v for validation messages
    const schema = signUpSchema(v);
    //zod form
    const form = useForm<TSignUpSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });
    //send email verif mutation
    const { mutate: sendVerifMail } = useSendVerificationMail(
        () => {
            setEmailSent(true);
            setIsVerifying(false);
        },
        () => {
            setIsVerifying(false);
        },
    );
    //create user mutation
    const { mutate: createUser, isPending } = useSignUpMutation(form, v, {
        onSuccessExtra: () => {
            setEmailCode("");
            setIsEmailVerified(false);
            setEmailSent(false);
        },
    });
    //send email verification
    const sendMail = () => {
        const email = form.getValues("email");
        if (!email) {
            form.setError("email", {
                type: "manual",
                message: v("emailRequired"),
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
                message: v("emailNotVerified"),
            });
            return;
        }
        createUser(data);
    });
    //
    const handleOpenChange = () => setIsSignUpOpen(!isSignupOpen);
    const openSignIn = () => {
        setIsSignUpOpen(false);
        setIsSignInOpen(true);
    };
    // verify code function
    const verifyCode = async () => {
        setIsCodeVerifying(true);
        try {
            const url = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
            const res = await fetch(`${url}/api/auth/verifyCode`, {
                method: "POST",
                body: JSON.stringify({
                    email: form.getValues("email"),
                    code: emailCode,
                }),
            });
            if (res.ok) {
                setIsCodeVerifying(false);
                setIsEmailVerified(true);
                form.clearErrors();
            } else {
                setIsCodeVerifying(false);
                form.setError("email", {
                    type: "manual",
                    message: v("rootNetworkError"),
                });
            }
        } catch (error) {
            setIsCodeVerifying(false);
            form.setError("root", {
                type: "manual",
                message: v("rootNetworkError"),
            });
            console.error(error);
        }
    };

    return (
        <Dialog onOpenChange={handleOpenChange} open={isSignupOpen}>
            <DialogTitle></DialogTitle>
            <DialogContent>
                <DialogHeader>
                    <DialogDescription>{t("description")}</DialogDescription>
                </DialogHeader>
                <div className="mx-auto w-full max-w-lg space-y-6 p-10 rounded-lg">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold font-heading">
                            {t("title")}
                        </h1>
                        <p className="text-muted-foreground">
                            {t("description")}
                        </p>
                    </div>

                    {form.formState.errors.root && (
                        <p className="text-sm font-medium text-white text-center bg-destructive py-1 rounded p-5">
                            {form.formState.errors.root.message}
                        </p>
                    )}

                    <Form {...form}>
                        <form onSubmit={onSubmit} className="space-y-4">
                            {/* First Name */}
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("firstName")}</FormLabel>
                                        <div className="relative">
                                            <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <FormControl>
                                                <Input
                                                    placeholder={t("firstName")}
                                                    className="pl-10 h-12"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Last Name */}
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("lastName")}</FormLabel>
                                        <div className="relative">
                                            <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <FormControl>
                                                <Input
                                                    placeholder={t("lastName")}
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
                                        <FormLabel>{t("email")}</FormLabel>
                                        <div className="relative flex space-x-2">
                                            <div className="relative w-full">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <FormControl>
                                                    <Input
                                                        placeholder={t("email")}
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
                                                    t("verifyButton")
                                                )}
                                            </Button>
                                        </div>

                                        {emailSent && (
                                            <>
                                                <p className="text-sm text-green-700">
                                                    {t("emailSentMessage")}
                                                </p>
                                                <div className="mt-3 space-y-2">
                                                    <FormLabel>
                                                        {t(
                                                            "enterVerificationCode",
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        placeholder={t(
                                                            "enterVerificationCode",
                                                        )}
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
                                                        {isCodeVerifying ? (
                                                            <Loader2 className="animate-spin" />
                                                        ) : (
                                                            t(
                                                                "confirmCodeButton",
                                                            )
                                                        )}
                                                    </Button>
                                                </div>
                                            </>
                                        )}

                                        {isEmailVerified && (
                                            <p className="text-sm text-green-600">
                                                {t("emailVerifiedMessage")}
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
                                        <FormLabel>{t("password")}</FormLabel>
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
                                {t("createAccountButton")}
                            </LoadingButton>
                        </form>
                    </Form>

                    <div className="text-center text-sm text-muted-foreground">
                        {t("alreadyHaveAccount")}{" "}
                        <button
                            onClick={openSignIn}
                            className="text-primary font-medium hover:underline"
                        >
                            {t("signIn")}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
