"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { confirmNewsletter, type SignupResult } from "@/app/lib/newsletter";
import { WelcomeCodeCard } from "@/app/components/site/WelcomeCodeCard";

/** Opened from the "confirm your email" link: confirms the subscription and shows the welcome code. */
export function ConfirmEmail() {
  const [result, setResult] = useState<SignupResult | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // once (React dev mode runs effects twice)
    started.current = true;
    const token = new URLSearchParams(window.location.search).get("token") ?? "";
    // Take the token out of the address bar (and so out of history / shared screenshots).
    window.history.replaceState(null, "", "/confirm-email/");
    void confirmNewsletter(token).then(setResult);
  }, []);

  if (!result) {
    return (
      <div className="confirm-box" role="status">
        <span className="sec-lbl">Newsletter</span>
        <h1>Confirming your email…</h1>
        <p>This only takes a moment.</p>
      </div>
    );
  }

  return (
    <div className={`confirm-box${result.ok ? " confirm-ok" : " confirm-failed"}`} role={result.ok ? "status" : "alert"}>
      <span className="sec-lbl">Newsletter</span>
      <h1>{result.ok ? "You're subscribed." : "We couldn't confirm your email."}</h1>
      <p>{result.message}</p>
      {result.welcome ? <WelcomeCodeCard welcome={result.welcome} /> : null}
      <Link className="btn btn-p" href="/collections/bedroom/mattresses/">Shop mattresses</Link>
    </div>
  );
}
