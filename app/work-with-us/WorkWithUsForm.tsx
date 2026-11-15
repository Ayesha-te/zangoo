"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { getTurnstileToken } from "@/app/lib/turnstile";
import { emailDomainAcceptsMail, emailError, emailSuggestion } from "@/app/lib/validation";

type Status = { state: "idle" | "sending" | "done" | "error"; message?: string };

/** Social profiles marketers can share (all optional). A full link or an @handle is accepted. */
const SOCIALS = [
  { name: "instagram", label: "Instagram", domains: ["instagram.com"], profile: (handle: string) => `https://www.instagram.com/${handle}` },
  { name: "facebook", label: "Facebook", domains: ["facebook.com", "fb.com"], profile: (handle: string) => `https://www.facebook.com/${handle}` },
  { name: "twitter", label: "X (Twitter)", domains: ["x.com", "twitter.com"], profile: (handle: string) => `https://x.com/${handle}` },
  { name: "tiktok", label: "TikTok", domains: ["tiktok.com"], profile: (handle: string) => `https://www.tiktok.com/@${handle}` },
  { name: "youtube", label: "YouTube", domains: ["youtube.com", "youtu.be"], profile: (handle: string) => `https://www.youtube.com/@${handle}` },
] as const;
type SocialName = (typeof SOCIALS)[number]["name"];

type Fields = {
  full_name: string;
  nationality: string;
  whatsapp: string;
  email: string;
  experience: string;
  website: string; // honeypot
} & Record<SocialName, string>;
type Errors = Partial<Record<keyof Fields | "has_experience", string>>;

const EMPTY: Fields = { full_name: "", nationality: "", whatsapp: "", email: "", experience: "", website: "", instagram: "", facebook: "", twitter: "", tiktok: "", youtube: "" };
const NAME = /^\p{L}[\p{L}\p{M}' .-]*$/u;

/** "@name", "name" or a link on the right site → the profile link; null when it isn't valid for that site. */
export function socialProfileUrl(raw: string, social: (typeof SOCIALS)[number]): string | null {
  const value = raw.trim();
  if (!value) return "";
  if (value.length > 200) return null;
  const handle = value.replace(/^@/, "");
  if (/^[A-Za-z0-9._-]{1,50}$/.test(handle) && !handle.includes("..")) return social.profile(handle);
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    const host = url.hostname.toLowerCase().replace(/^(www\.|m\.|mobile\.)/, "");
    if (!["http:", "https:"].includes(url.protocol) || !social.domains.some((domain) => host === domain)) return null;
    if (url.pathname.replace(/\/+$/, "") === "") return null; // just the site, no profile
    url.protocol = "https:";
    return url.toString();
  } catch {
    return null;
  }
}

function validate(fields: Fields, hasExperience: "yes" | "no" | ""): Errors {
  const errors: Errors = {};
  const name = fields.full_name.trim();
  if (!name) errors.full_name = "Please enter your full name.";
  else if (name.length < 2 || name.length > 60 || !NAME.test(name)) errors.full_name = "Please enter your full name using letters only (up to 60 characters).";
  const country = fields.nationality.trim();
  if (!country) errors.nationality = "Please enter your country of residence.";
  else if (country.length < 2 || country.length > 56 || !NAME.test(country)) errors.nationality = "Please enter a valid country name.";
  const whatsapp = fields.whatsapp.replace(/[\s()-]/g, "");
  if (!whatsapp) errors.whatsapp = "Please enter your WhatsApp number.";
  else if (!/^\+[1-9]\d{7,14}$/.test(whatsapp)) errors.whatsapp = "Please enter your number with the country code, e.g. +44 7700 900123.";
  if (fields.email.trim()) {
    const problem = emailError(fields.email);
    const suggestion = emailSuggestion(fields.email);
    if (problem || suggestion) errors.email = suggestion ? `Please check your email address. Did you mean ${suggestion}?` : problem ?? undefined;
  }
  if (!hasExperience) errors.has_experience = "Please choose whether you have digital marketing experience.";
  const experience = fields.experience.trim();
  if (hasExperience === "yes" && experience.length < 10) errors.experience = "Please tell us briefly about your experience (at least 10 characters).";
  if (experience.length > 2000) errors.experience = "Please keep this under 2000 characters.";
  for (const social of SOCIALS) {
    if (socialProfileUrl(fields[social.name], social) === null) {
      errors[social.name] = `Please enter your ${social.label} profile link (e.g. ${social.profile("yourname")}) or @username.`;
    }
  }
  return errors;
}

/** "Work with Us" form: saved by the WordPress snippet (wordpress/orthobedroom-discounts.php) via /wp-apply/. */
export function WorkWithUsForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [hasExperience, setHasExperience] = useState<"yes" | "no" | "">("");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const set = (name: keyof Fields, value: string) => {
    const next = { ...fields, [name]: value };
    setFields(next);
    if (touched) setErrors(validate(next, hasExperience));
  };
  const choose = (value: "yes" | "no") => {
    setHasExperience(value);
    if (touched) setErrors(validate(fields, value));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    const found = validate(fields, hasExperience);
    if (!found.email && fields.email.trim() && (await emailDomainAcceptsMail(fields.email)) === false) {
      found.email = "This email address can't receive emails. Please check it for typos.";
    }
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      const el = document.querySelector<HTMLElement>(`[data-field="${first}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.querySelector<HTMLElement>("input, textarea")?.focus({ preventScroll: true });
      return;
    }

    setStatus({ state: "sending" });
    try {
      const socials = Object.fromEntries(SOCIALS.map((social) => [social.name, socialProfileUrl(fields[social.name], social) ?? ""]));
      const response = await fetch("/wp-apply/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fields.full_name.trim(),
          nationality: fields.nationality.trim(),
          whatsapp: fields.whatsapp.replace(/[\s()-]/g, ""),
          email: fields.email.trim(),
          has_experience: hasExperience === "yes",
          experience: fields.experience.trim(),
          ...socials,
          website: fields.website,
          turnstile: await getTurnstileToken("apply"),
        }),
      });
      const result = (await response.json().catch(() => null)) as { ok?: unknown; message?: unknown } | null;
      const message = typeof result?.message === "string" ? result.message : undefined;
      if (response.ok && result?.ok === true) {
        setStatus({ state: "done", message: message ?? "Thank you! We'll contact you on WhatsApp." });
        return;
      }
      // Only show messages from our own endpoint (it always sends "ok"); WordPress' own errors are technical.
      setStatus({ state: "error", message: (typeof result?.ok === "boolean" && message) || "Sorry, we couldn't send your details. Please try again." });
    } catch {
      setStatus({ state: "error", message: "Sorry, we couldn't send your details. Please check your connection and try again." });
    }
  }

  if (status.state === "done") {
    return (
      <div className="apply-done" role="status">
        <strong>Application received</strong>
        <p>{status.message}</p>
      </div>
    );
  }

  const field = (name: keyof Fields, label: ReactNode, input: ReactNode, hint?: ReactNode) => (
    <label className={errors[name] ? "apply-invalid" : undefined} data-field={name}>
      <span>{label}</span>
      {input}
      {errors[name] ? <small className="apply-field-error" role="alert">{errors[name]}</small> : hint ? <small>{hint}</small> : null}
    </label>
  );
  const input = (name: keyof Fields, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input name={name} value={fields[name]} onChange={(event) => set(name, event.target.value)} aria-invalid={Boolean(errors[name])} {...props} />
  );

  return (
    <form className="apply-form" onSubmit={onSubmit} noValidate>
      {field("full_name", "Full name", input("full_name", { autoComplete: "name", maxLength: 60 }))}
      {field("nationality", "Country of residence", input("nationality", { autoComplete: "country-name", maxLength: 56 }))}
      {field("whatsapp", "WhatsApp number", input("whatsapp", { type: "tel", inputMode: "tel", placeholder: "+44 7700 900123", autoComplete: "tel", maxLength: 22 }), "Include your country code.")}
      {field("email", <>Email <em>(optional)</em></>, input("email", { type: "email", autoComplete: "email", maxLength: 254 }))}
      <fieldset data-field="has_experience" className={errors.has_experience ? "apply-invalid" : undefined}>
        <legend>Do you have digital marketing experience?</legend>
        <label className="apply-choice">
          <input type="radio" name="has_experience" value="yes" checked={hasExperience === "yes"} onChange={() => choose("yes")} />
          Yes, I have experience
        </label>
        <label className="apply-choice">
          <input type="radio" name="has_experience" value="no" checked={hasExperience === "no"} onChange={() => choose("no")} />
          No experience yet
        </label>
        {errors.has_experience ? <small className="apply-field-error" role="alert">{errors.has_experience}</small> : null}
      </fieldset>
      {hasExperience
        ? field(
            "experience",
            hasExperience === "yes" ? "Briefly describe your experience" : <>Anything you&rsquo;d like to tell us? <em>(optional)</em></>,
            <textarea
              name="experience"
              value={fields.experience}
              onChange={(event) => set("experience", event.target.value)}
              aria-invalid={Boolean(errors.experience)}
              maxLength={2000}
              rows={hasExperience === "yes" ? 5 : 3}
              placeholder={hasExperience === "yes" ? "Platforms you use, audience size, brands you have promoted…" : undefined}
            />,
            `${fields.experience.length}/2000`,
          )
        : null}
      <fieldset className="apply-socials">
        <legend>Your social media profiles <em>(optional)</em></legend>
        <small>Paste a link to your profile or type your @username.</small>
        {SOCIALS.map((social) =>
          <div key={social.name}>
            {field(social.name, social.label, input(social.name, { type: "text", inputMode: "url", autoComplete: "off", maxLength: 200, placeholder: `@yourname or ${social.domains[0]}/yourname` }))}
          </div>,
        )}
      </fieldset>
      {/* Honeypot: hidden from people, filled by bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="apply-honeypot" value={fields.website} onChange={(event) => set("website", event.target.value)} />
      {touched && Object.keys(errors).length ? <p className="apply-error" role="alert">Please check the highlighted fields.</p> : null}
      {status.state === "error" ? <p className="apply-error" role="alert">{status.message}</p> : null}
      <button className="btn btn-p" type="submit" disabled={status.state === "sending"}>
        {status.state === "sending" ? "Sending…" : "Send my details"}
      </button>
    </form>
  );
}
