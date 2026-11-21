// Stripe.js (loaded from js.stripe.com), shared by the checkout and the Klarna instalment messages.
/* eslint-disable @typescript-eslint/no-explicit-any */
export type StripeJs = any;
declare global {
  interface Window {
    Stripe?: (key: string) => StripeJs;
  }
}

let stripeScript: Promise<void> | null = null;
export function loadStripeJs() {
  stripeScript ??= new Promise<void>((resolve, reject) => {
    if (window.Stripe) return resolve();
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      stripeScript = null;
      reject(new Error("Stripe could not be loaded"));
    };
    document.head.append(script);
  });
  return stripeScript;
}

const instances = new Map<string, StripeJs>();
/** One Stripe instance per key (Stripe recommends not creating several). */
export async function getStripe(publishableKey: string): Promise<StripeJs | null> {
  await loadStripeJs();
  if (!window.Stripe) return null;
  if (!instances.has(publishableKey)) instances.set(publishableKey, window.Stripe(publishableKey));
  return instances.get(publishableKey);
}
