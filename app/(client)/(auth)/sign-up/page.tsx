import { SignUpForm } from "@/app/components/auth/SignupForm";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
