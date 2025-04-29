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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/api/auth";
import LoadingButton from "../loaders/LoadingButton";
import { showErrorToast } from "@/lib/toasts/toasts";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: authService.signUp,
    onSuccess: () => {
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

  return (
    <div className="mx-auto w-full max-w-lg space-y-6 border-2 p-10 rounded-lg">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-heading">Create an account</h1>
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
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          {isPending ? (
            <LoadingButton />
          ) : (
            <Button type="submit" className="w-full" disabled={isPending}>
              Create Account
            </Button>
          )}
        </form>
      </Form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="#" className="text-primary font-medium hover:underline">
          Sign in
        </a>
      </div>
    </div>
  );
}
