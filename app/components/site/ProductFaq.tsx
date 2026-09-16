"use client";

import { useId, useState } from "react";

type ProductFaqProps = {
  faqs: Array<{ question: string; answer: string }>;
};

export function ProductFaq({ faqs }: ProductFaqProps) {
  const instanceId = useId().replace(/:/g, "");
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  return (
    <div className="lp-faq-grid" role="list">
      {faqs.map((faq, index) => {
        const isOpen = openIndexes.has(index);
        const answerId = `product-faq-answer-${instanceId}-${index}`;

        return (
          <div className="lp-faq-item" role="listitem" key={faq.question}>
            <button
              className="lp-faq-btn"
              type="button"
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() =>
                setOpenIndexes((current) => {
                  const next = new Set(current);
                  if (next.has(index)) {
                    next.delete(index);
                  } else {
                    next.add(index);
                  }
                  return next;
                })
              }
            >
              <span>{faq.question}</span>
              <span className="lp-faq-icon" aria-hidden="true">{isOpen ? "-" : "+"}</span>
            </button>
            <div className="lp-faq-body" id={answerId} aria-hidden={!isOpen}>
              <p>{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
