"use client";

import { useState } from "react";
import type { WelcomeCode } from "@/app/lib/newsletter";

/** The sign-up welcome code, shown on screen right after signing up, with a copy button and expiry date. */
export function WelcomeCodeCard({ welcome, tone = "light" }: { welcome: WelcomeCode; tone?: "light" | "dark" }) {
  const [copied, setCopied] = useState(false);
  // Midday avoids the date shifting a day in other timezones.
  const expiry = welcome.expires
    ? new Date(`${welcome.expires}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(welcome.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the code is still visible to copy by hand.
    }
  }

  return (
    <div className={`welcome-code welcome-code-${tone}`}>
      <span className="welcome-code-label">Your {welcome.percent}% welcome code</span>
      <div className="welcome-code-row">
        <strong>{welcome.code}</strong>
        <button type="button" onClick={copy} aria-label={`Copy code ${welcome.code}`}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <small>
        {expiry ? <>Expires <b>{expiry}</b>. </> : null}
        One use, on your first order. Enter it in your basket.
      </small>
    </div>
  );
}
