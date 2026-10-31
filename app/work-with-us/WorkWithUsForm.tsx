"use client";

import { useState, type FormEvent } from "react";

type Status = { state: "idle" | "sending" | "done" | "error"; message?: string };

/** "Work with Us" form: saved by the WordPress snippet (wordpress/orthobedroom-discounts.php) via /wp-apply/. */
export function WorkWithUsForm() {
  const [hasExperience, setHasExperience] = useState<"yes" | "no" | "">("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    if (!hasExperience) {
      setStatus({ state: "error", message: "Please choose whether you have digital marketing experience." });
      return;
    }

    setStatus({ state: "sending" });
    try {
      const response = await fetch("/wp-apply/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: field("full_name"),
          nationality: field("nationality"),
          whatsapp: field("whatsapp"),
          email: field("email"),
          has_experience: hasExperience === "yes",
          experience: field("experience"),
          website: field("website"),
        }),
      });
      const result = (await response.json().catch(() => null)) as { ok?: unknown; message?: unknown } | null;
      const message = typeof result?.message === "string" ? result.message : undefined;
      if (response.ok && result?.ok === true) {
        setStatus({ state: "done", message: message ?? "Thank you! We'll contact you on WhatsApp." });
        form.reset();
        setHasExperience("");
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

  return (
    <form className="apply-form" onSubmit={onSubmit}>
      <label>
        <span>Full name</span>
        <input name="full_name" required minLength={2} maxLength={120} autoComplete="name" />
      </label>
      <label>
        <span>Nationality</span>
        <input name="nationality" required minLength={2} maxLength={80} autoComplete="country-name" />
      </label>
      <label>
        <span>WhatsApp number</span>
        <input name="whatsapp" type="tel" required inputMode="tel" placeholder="+44 7700 900123" pattern="[+0-9 ()-]{7,22}" autoComplete="tel" />
        <small>Include your country code.</small>
      </label>
      <label>
        <span>Email <em>(optional)</em></span>
        <input name="email" type="email" maxLength={190} autoComplete="email" />
      </label>
      <fieldset>
        <legend>Do you have digital marketing experience?</legend>
        <label className="apply-choice">
          <input type="radio" name="has_experience" value="yes" checked={hasExperience === "yes"} onChange={() => setHasExperience("yes")} />
          Yes, I have experience
        </label>
        <label className="apply-choice">
          <input type="radio" name="has_experience" value="no" checked={hasExperience === "no"} onChange={() => setHasExperience("no")} />
          No experience yet
        </label>
      </fieldset>
      {hasExperience === "yes" ? (
        <label>
          <span>Briefly describe your experience</span>
          <textarea name="experience" required minLength={10} maxLength={2000} rows={5} placeholder="Platforms you use, audience size, brands you have promoted…" />
        </label>
      ) : null}
      {hasExperience === "no" ? (
        <label>
          <span>Anything you&rsquo;d like to tell us? <em>(optional)</em></span>
          <textarea name="experience" maxLength={2000} rows={3} />
        </label>
      ) : null}
      {/* Honeypot: hidden from people, filled by bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="apply-honeypot" />
      {status.state === "error" ? <p className="apply-error" role="alert">{status.message}</p> : null}
      <button className="btn btn-p" type="submit" disabled={status.state === "sending"}>
        {status.state === "sending" ? "Sending…" : "Send my details"}
      </button>
    </form>
  );
}
