// Newsletter sign-up with DOUBLE OPT-IN (client, 19/11/2026), handled by the WordPress snippet
// (wordpress/orthobedroom-discounts.php):
//   1. subscribeToNewsletter → /wp-signup/: saves the sign-up and emails a "confirm your email" link (Brevo).
//   2. The link opens /confirm-email/?token=… → confirmNewsletter → /wp-confirm/: subscribes the person (Brevo list)
//      and returns + emails the one-time 10% welcome code.
// Same-origin /wp-signup/ and /wp-confirm/ are proxied (vercel.json / next.config.ts).
import { getTurnstileToken } from "./turnstile";

export type WelcomeCode = { code: string; percent: number; expires: string | null };
/** pending: a confirmation email was sent; the welcome code comes after the link is clicked. */
export type SignupResult = { ok: boolean; message: string; welcome?: WelcomeCode; pending?: boolean };

type SignupResponse = { ok?: unknown; message?: unknown; code?: unknown; percent?: unknown; expires?: unknown; pending?: unknown };

function readWelcomeCode(data: SignupResponse): WelcomeCode | undefined {
  if (typeof data.code !== "string" || !/^[A-Z0-9-]{4,40}$/i.test(data.code)) return undefined;
  return {
    code: data.code.toUpperCase(),
    percent: typeof data.percent === "number" ? data.percent : 10,
    expires: typeof data.expires === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data.expires) ? data.expires : null,
  };
}

export async function subscribeToNewsletter(input: { email: string; firstName?: string; website?: string }): Promise<SignupResult> {
  try {
    const response = await fetch("/wp-signup/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: input.email.trim().slice(0, 254),
        first_name: input.firstName?.trim().slice(0, 40) ?? "",
        website: input.website ?? "",
        // Spam check token ("" while Turnstile is off).
        turnstile: await getTurnstileToken("signup"),
      }),
    });
    const data = (await response.json().catch(() => null)) as SignupResponse | null;
    const message = typeof data?.message === "string" ? data.message : undefined;
    if (response.ok && data?.ok === true) {
      return { ok: true, message: message ?? "Almost there! Check your inbox and click the link to confirm your email.", welcome: readWelcomeCode(data), pending: data.pending === true };
    }
    // Only show messages from our own endpoint (it always sends "ok"); WordPress' own errors are technical.
    const ownMessage = data && typeof data.ok === "boolean" ? message : undefined;
    return { ok: false, message: ownMessage ?? "Sorry, we couldn't sign you up right now. Please try again." };
  } catch {
    return { ok: false, message: "Sorry, we couldn't sign you up right now. Please check your connection and try again." };
  }
}

/** Step 2 of double opt-in: the token from the confirmation link. */
export async function confirmNewsletter(token: string): Promise<SignupResult> {
  if (!/^[A-Za-z0-9]{32}$/.test(token)) return { ok: false, message: "This confirmation link is not valid. Please sign up again to get a new link." };
  try {
    const response = await fetch("/wp-confirm/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
    const data = (await response.json().catch(() => null)) as SignupResponse | null;
    const message = typeof data?.message === "string" ? data.message : undefined;
    if (response.ok && data?.ok === true) return { ok: true, message: message ?? "Your email is confirmed. Thank you!", welcome: readWelcomeCode(data) };
    const ownMessage = data && typeof data.ok === "boolean" ? message : undefined;
    return { ok: false, message: ownMessage ?? "Sorry, we couldn't confirm your email right now. Please try the link again in a few minutes." };
  } catch {
    return { ok: false, message: "Sorry, we couldn't confirm your email right now. Please check your connection and try again." };
  }
}
