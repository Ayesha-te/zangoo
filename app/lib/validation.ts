// Shared form checks (checkout and sign-up forms). Client-side only: WooCommerce and the WordPress snippet still
// validate on their side, these stop mistakes and junk before anything is sent.

/** Character limits for form fields (what WooCommerce and couriers accept comfortably). */
export const LIMITS = {
  email: 254,
  name: 40,
  address: 80,
  city: 40,
  postcode: 8,
  phone: 20,
  instructions: 500,
  code: 40,
} as const;

// ── Email ──
// Local part: letters, digits and the usual symbols, no leading/trailing/double dots. Domain: labels of letters,
// digits and hyphens, ending in a letters-only TLD of 2+ characters.
const EMAIL = /^(?!\.)(?!.*\.\.)[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}(?<!\.)@(?=.{4,253}$)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

/** Problem with an email address as typed, or null when it looks valid. */
export function emailError(raw: string): string | null {
  const email = raw.trim();
  if (!email) return "Please enter your email address.";
  if (email.length > LIMITS.email || !EMAIL.test(email)) return "Please enter a valid email address, e.g. name@example.com.";
  return null;
}

// Common misspellings of the big email providers → the right domain.
const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com", "gmaill.com": "gmail.com", "gnail.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com", "gmail.om": "gmail.com", "gmail.co.uk": "gmail.com", "googlemail.co": "googlemail.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmal.com": "hotmail.com", "hotmail.con": "hotmail.com", "hotmail.co": "hotmail.co.uk",
  "hotmail.co.k": "hotmail.co.uk", "hotmail.couk": "hotmail.co.uk",
  "outlok.com": "outlook.com", "outlook.con": "outlook.com", "outlook.co": "outlook.com",
  "yahooo.com": "yahoo.com", "yaho.com": "yahoo.com", "yahoo.con": "yahoo.com", "yahoo.co": "yahoo.co.uk", "yahoo.couk": "yahoo.co.uk",
  "iclod.com": "icloud.com", "icloud.con": "icloud.com", "icoud.com": "icloud.com",
  "btinternet.con": "btinternet.com", "btinternet.co": "btinternet.com", "btinternt.com": "btinternet.com",
  "live.co": "live.co.uk", "sky.con": "sky.com",
};

/** "Did you mean …?" for a likely misspelt provider, or null. */
export function emailSuggestion(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const fixed = DOMAIN_TYPOS[email.slice(at + 1)];
  return fixed ? `${raw.trim().slice(0, at)}@${fixed}` : null;
}

type DnsAnswer = { Status?: number; Answer?: Array<{ type: number; data: string }> };
const domainCache = new Map<string, Promise<boolean | null>>();

async function dns(name: string, type: "MX" | "A" | "AAAA"): Promise<DnsAnswer> {
  const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, {
    headers: { accept: "application/dns-json" },
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error(`DNS ${response.status}`);
  return response.json();
}

/**
 * Can this email domain receive email? Looks up its mail servers (DNS over HTTPS; only the domain is sent, never
 * the address). true = yes, false = the domain doesn't exist or says it takes no email, null = couldn't tell
 * (network problem): never block a customer on null.
 */
export function emailDomainAcceptsMail(raw: string): Promise<boolean | null> {
  const domain = raw.trim().toLowerCase().split("@")[1] ?? "";
  if (!domain) return Promise.resolve(false);
  let pending = domainCache.get(domain);
  if (!pending) {
    pending = (async () => {
      try {
        const mx = await dns(domain, "MX");
        if (mx.Status === 3) return false; // NXDOMAIN: no such domain
        if (mx.Status !== 0) return null;
        const records = (mx.Answer ?? []).filter((answer) => answer.type === 15);
        if (records.length) {
          // "Null MX" (RFC 7505): the domain publishes that it accepts no email.
          const accepts = records.some((record) => /[a-z0-9]/i.test(record.data.trim().split(/\s+/).pop() ?? ""));
          return accepts;
        }
        // No MX: mail goes to the domain's own address, if it has one.
        const [a, aaaa] = await Promise.all([dns(domain, "A"), dns(domain, "AAAA")]);
        return Boolean(a.Answer?.some((answer) => answer.type === 1) || aaaa.Answer?.some((answer) => answer.type === 28));
      } catch {
        return null;
      }
    })();
    domainCache.set(domain, pending);
  }
  return pending;
}

// ── UK phone ──
/**
 * A UK mobile or landline in any common format (07700 900123, +44 7700 900123, 0044…, (020) 7946 0018) →
 * the national number without the leading 0 (e.g. "7700900123"), or null when it isn't a valid UK number.
 */
export function ukPhoneNational(raw: string): string | null {
  let digits = raw.trim();
  if (!/^[+0-9 ()-]*$/.test(digits)) return null;
  digits = digits.replace(/\(0\)/g, "").replace(/\D/g, "");
  if (digits.startsWith("0044")) digits = digits.slice(4);
  else if (digits.startsWith("44") && digits.length >= 11) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  // Mobiles 071–075, 077–079 (10 digits after the 0; 076 pagers and 070 personal numbers excluded);
  // landlines 01, 02, 03 (9 or 10 digits after the 0).
  if (/^7[1-57-9]\d{8}$/.test(digits)) return digits;
  if (/^(1\d{8,9}|2\d{9}|3\d{9})$/.test(digits)) return digits;
  return null;
}

/**
 * A UK mobile only (client, 17/11/2026: no landlines; delivery updates go by text): 07 + 9 digits, in any common
 * format (07123 456789, +44 7123 456789, 0044…). Returns "7123456789" or null.
 */
export function ukMobileNational(raw: string): string | null {
  const national = ukPhoneNational(raw);
  return national && /^7[1-57-9]\d{8}$/.test(national) ? national : null;
}

/** "+44 7700 900123" style, for the order. */
export function formatUkPhone(national: string) {
  return national.startsWith("7") || national.length === 10
    ? `+44 ${national.slice(0, 4)} ${national.slice(4)}`
    : `+44 ${national.slice(0, 3)} ${national.slice(3)}`;
}

// ── Names and addresses ──
const NAME = /^\p{L}[\p{L}\p{M}' .-]*$/u;
const ADDRESS = /^[\p{L}\p{M}\d ,.'/#&()-]+$/u;
const CITY = /^\p{L}[\p{L}\p{M}' .-]*$/u;
export const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

export function nameError(raw: string, label: string): string | null {
  const value = raw.trim();
  if (!value) return `Please enter your ${label}.`;
  if (value.length < 2) return `Please enter your full ${label}.`;
  if (value.length > LIMITS.name) return `Please keep your ${label} under ${LIMITS.name} characters.`;
  if (!NAME.test(value)) return `Please use letters only in your ${label}.`;
  return null;
}

export function addressError(raw: string, required: boolean): string | null {
  const value = raw.trim();
  if (!value) return required ? "Please enter your address." : null;
  if (required && value.length < 3) return "Please enter your full address.";
  if (value.length > LIMITS.address) return `Please keep each address line under ${LIMITS.address} characters.`;
  if (!ADDRESS.test(value)) return "Please use letters, numbers and normal punctuation only.";
  if (required && !/\p{L}/u.test(value)) return "Please include the street name.";
  return null;
}

export function cityError(raw: string): string | null {
  const value = raw.trim();
  if (!value) return "Please enter your town or city.";
  if (value.length < 2 || value.length > LIMITS.city || !CITY.test(value)) return "Please enter a valid town or city.";
  return null;
}

export function postcodeError(raw: string): string | null {
  return UK_POSTCODE.test(raw.trim()) ? null : "Please enter a valid UK postcode, e.g. SW1A 1AA.";
}
