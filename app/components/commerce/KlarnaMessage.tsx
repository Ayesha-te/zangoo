"use client";

import { useEffect, useRef } from "react";
import { getStripe, type StripeJs } from "@/app/lib/stripe";

/**
 * "Pay in 3 interest-free payments of £x with Klarna. Learn more" (Stripe's Payment Method Messaging Element).
 * Stripe works out the instalment amounts and wording; shows nothing if Klarna isn't available for the amount.
 */
export function KlarnaMessage({ amount, publishableKey, className }: { amount: number; publishableKey: string | null; className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<StripeJs>(null);
  const pennies = Math.round(amount * 100);

  useEffect(() => {
    if (!publishableKey || !mountRef.current || elementRef.current) return;
    let cancelled = false;
    getStripe(publishableKey)
      .then((stripe) => {
        if (cancelled || !stripe || !mountRef.current || elementRef.current) return;
        const element = stripe.elements({ fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap" }] }).create("paymentMethodMessaging", {
          amount: pennies,
          currency: "GBP",
          countryCode: "GB",
          paymentMethodTypes: ["klarna"],
          style: { fontFamily: "DM Sans, system-ui, sans-serif", fontSize: "15px", textColor: "#1a2e44", linkTextColor: "#1557A7", logoColor: "color" },
        });
        element.mount(mountRef.current);
        elementRef.current = element;
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
    // Created once; the amount is kept up to date below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishableKey]);

  useEffect(() => {
    if (pennies > 0) elementRef.current?.update({ amount: pennies });
  }, [pennies]);

  if (!publishableKey) return null;
  return <div ref={mountRef} className={className} aria-label="Pay in instalments with Klarna" />;
}
