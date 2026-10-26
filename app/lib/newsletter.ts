// Newsletter sign-up: sends the email to the WordPress discount snippet (wordpress/orthobedroom-discounts.php),
// which saves the sign-up and returns (and emails) a one-time 10% welcome code. Same-origin /wp-signup/ is proxied
// (vercel.json / next.config.ts).

export type WelcomeCode = { code: string; percent: number; expires: string | null };
export type SignupResult = { ok: boolean; message: string; welcome?: WelcomeCode };

type SignupResponse = { ok?: unknown; message?: unknown; code?: unknown; percent?: unknown; expires?: unknown };

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
      body: JSON.stringify({ email: input.email.trim(), first_name: input.firstName?.trim() ?? "", website: input.website ?? "" }),
    });
    const data = (await response.json().catch(() => null)) as SignupResponse | null;
    const message = typeof data?.message === "string" ? data.message : undefined;
    if (response.ok && data?.ok === true) {
      return { ok: true, message: message ?? "Thanks! Check your inbox for your welcome code.", welcome: readWelcomeCode(data) };
    }
    // Only show messages from our own endpoint (it always sends "ok"); WordPress' own errors are technical.
    const ownMessage = data && typeof data.ok === "boolean" ? message : undefined;
    return { ok: false, message: ownMessage ?? "Sorry, we couldn't sign you up right now. Please try again." };
  } catch {
    return { ok: false, message: "Sorry, we couldn't sign you up right now. Please check your connection and try again." };
  }
}
