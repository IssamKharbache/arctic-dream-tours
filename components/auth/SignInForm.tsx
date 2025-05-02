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
import { Eye, EyeClosed } from "lucide-react";

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
            <h1 className="text-3xl font-bold font-heading">Welcome back</h1>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeClosed className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {isPending ? (
                <LoadingButton />
              ) : (
                <Button type="submit" className="w-full" disabled={isPending}>
                  Sign In
                </Button>
              )}
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
