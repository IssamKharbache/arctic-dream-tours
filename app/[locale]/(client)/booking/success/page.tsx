import React from "react";
import { stripe } from "@/utils/stripe";
import { redirect } from "next/navigation";

const page = async ({
  searchParams,
}: {
  searchParams: { session_id: string };
}) => {
  const sessionId = (await searchParams).session_id;
  if (!sessionId) {
    redirect("/");
  }
  const session = await getSession(sessionId);
  if (!session) {
    return <h1>Invalid stripe session</h1>;
  }
  if (session?.status === "expired") {
    return <h1>Your session is expired</h1>;
  }
  if (session.status === "open") {
    return <h1>Your payment is in progress</h1>;
  }
  return (
    <div className="min-h-screen pt-28 flex items-start justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-green-300">
      Your payment was completed successfully
    </div>
  );
};

export default page;

export const getSession = async (sessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    return null;
  }
};
