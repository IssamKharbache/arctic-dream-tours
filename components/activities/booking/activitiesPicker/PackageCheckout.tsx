
"use client";

import { useMemo } from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type PackageCheckoutProps = {
  clientSecret: string;
};

export default function PackageCheckout({
  clientSecret,
}: PackageCheckoutProps) {
  const options = useMemo(
    () => ({ clientSecret }),
    [clientSecret],
  );

  return (
    <div className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
