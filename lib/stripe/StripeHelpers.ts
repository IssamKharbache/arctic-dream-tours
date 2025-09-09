import { stripe } from "@/utils/stripe";

export const getSession = async (sessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    return null;
  }
};
