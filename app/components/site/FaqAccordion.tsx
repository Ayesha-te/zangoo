"use client";
import { useState } from "react";

export function FaqAccordion({ faqs }: { faqs: Array<[string, string]> }) {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="simple-faq-list">{faqs.map(([question, answer], index) => {
    const active = open === index;
    return <article className={active ? "is-open" : ""} key={question}>
      <button type="button" aria-expanded={active} onClick={() => setOpen(active ? null : index)}>
        <span>{question}</span><i aria-hidden="true">{active ? "−" : "+"}</i>
      </button>
      <div className="simple-faq-answer"><p>{answer}</p></div>
    </article>;
  })}</div>;
}
