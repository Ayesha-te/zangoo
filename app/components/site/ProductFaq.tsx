"use client";

import { useState } from "react";

type ProductFaqProps = {
  faqs: Array<{ question: string; answer: string }>;
};

export function ProductFaq({ faqs }: ProductFaqProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="lp-faq-grid" role="list">
      {faqs.map((faq, index) => {
        const isOpen = activeIndex === index;
        const answerId = `product-faq-answer-${index}`;

        return (
          <div className="lp-faq-item" role="listitem" key={faq.question}>
            <button
              className="lp-faq-btn"
              type="button"
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => setActiveIndex(isOpen ? null : index)}
            >
              <span>{faq.question}</span>
              <span className="lp-faq-icon" aria-hidden="true">+</span>
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
