import SuccessfullPayment from "@/components/activities/booking/SuccessfullPayment";
import { getSession } from "@/lib/stripe/StripeHelpers";
import { stripe } from "@/utils/stripe";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

const page = async ({ params, searchParams }: PageProps) => {
  const sessionId = (await searchParams).session_id;
  const bookingId = (await params).id;

  if (!sessionId) {
    redirect("/");
  }
  const session = await getSession(sessionId);
  if (!session) {
    return (
      <h1 className="min-h-screen bg-red-500 text-shadow-teal-50">
        Invalid stripe session
      </h1>
    );
  }
  if (session?.status === "expired") {
    return <h1>Your session is expired</h1>;
  }
  if (session.status === "open") {
    return <h1>Your payment is in progress</h1>;
  }

  return <SuccessfullPayment bookingId={bookingId} />;
};

export default page;
