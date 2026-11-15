// Cloudflare Turnstile spam check (a privacy-friendly alternative to Google reCAPTCHA). OFF until both keys exist:
//   • NEXT_PUBLIC_TURNSTILE_SITE_KEY in Vercel (public site key; needs a redeploy), and
//   • define( 'OB_TURNSTILE_SECRET', '…' ); in WordPress wp-config.php (secret key), used by the WordPress snippet
//     (wordpress/orthobedroom-discounts.php) to check the token on checkout, sign-ups and applications.
// Without the secret WordPress accepts requests as before, so setting only the site key never blocks customers.

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let script: Promise<void> | null = null;
function loadTurnstile() {
  script ??= new Promise<void>((resolve, reject) => {
    if (window.turnstile) return resolve();
    const tag = document.createElement("script");
    tag.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    tag.async = true;
    tag.onload = () => resolve();
    tag.onerror = () => {
      script = null;
      reject(new Error("Turnstile could not be loaded"));
    };
    document.head.append(tag);
  });
  return script;
}

/**
 * A one-time spam-check token for a form submission ("" when Turnstile is off or can't load, so forms keep
 * working and WordPress decides). Invisible for almost everyone; if Cloudflare wants a click, a small box appears
 * at the bottom of the screen until it is done.
 */
export async function getTurnstileToken(action: string): Promise<string> {
  if (!TURNSTILE_SITE_KEY || typeof window === "undefined") return "";
  try {
    await loadTurnstile();
  } catch {
    return "";
  }
  if (!window.turnstile) return "";
  const box = document.createElement("div");
  box.setAttribute("style", "position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483000");
  document.body.append(box);
  return new Promise<string>((resolve) => {
    let widgetId = "";
    const finish = (token: string) => {
      clearTimeout(timer);
      if (widgetId) window.turnstile?.remove(widgetId);
      box.remove();
      resolve(token);
    };
    const timer = setTimeout(() => finish(""), 60000);
    widgetId = window.turnstile!.render(box, {
      sitekey: TURNSTILE_SITE_KEY,
      action,
      appearance: "interaction-only",
      callback: (token: string) => finish(token),
      "error-callback": () => finish(""),
      "timeout-callback": () => finish(""),
    });
  });
}
