import type { Metadata } from "next";
import { getStripeCheckoutConfig } from "@/app/lib/woocommerce/api";
import { CheckoutExperience } from "./CheckoutExperience";

export const metadata: Metadata = {
  title: "Secure Checkout | OrthoBedroom",
  description: "Secure checkout for your OrthoBedroom order.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  // Stripe publishable key (public) read at build time; secret keys stay in WordPress.
  const stripe = await getStripeCheckoutConfig();
  return <CheckoutExperience stripePublishableKey={stripe?.publishableKey ?? null} />;
}
