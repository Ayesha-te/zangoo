// Newsletter sign-up: sends the email to the WordPress discount snippet (wordpress/orthobedroom-discounts.php),
// which emails a one-time 10% welcome code. Same-origin /wp-signup/ is proxied (vercel.json / next.config.ts).

export type SignupResult = { ok: boolean; message: string };

export async function subscribeToNewsletter(input: { email: string; firstName?: string; website?: string }): Promise<SignupResult> {
  try {
    const response = await fetch("/wp-signup/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input.email.trim(), first_name: input.firstName?.trim() ?? "", website: input.website ?? "" }),
    });
    const data = (await response.json().catch(() => null)) as Partial<SignupResult> | null;
    if (response.ok && data?.ok) return { ok: true, message: data.message ?? "Thanks! Check your inbox for your welcome code." };
    // Only show messages from our own endpoint (it always sends "ok"); WordPress' own errors are technical.
    const ownMessage = data && typeof data.ok === "boolean" ? data.message : undefined;
    return { ok: false, message: ownMessage ?? "Sorry, we couldn't sign you up right now. Please try again." };
  } catch {
    return { ok: false, message: "Sorry, we couldn't sign you up right now. Please check your connection and try again." };
  }
}
