"use client";

import { useId, useState } from "react";

type ProductFaqProps = {
  faqs: Array<{ question: string; answer: string }>;
};

export function ProductFaq({ faqs }: ProductFaqProps) {
  const instanceId = useId().replace(/:/g, "");
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());
  const columns = [faqs.filter((_, index) => index % 2 === 0), faqs.filter((_, index) => index % 2 === 1)];

  function renderColumn(columnFaqs: Array<{ question: string; answer: string }>, columnIndex: number) {
    return columnFaqs.map((faq, itemIndex) => {
      const index = columnIndex + itemIndex * 2;
      const isOpen = openIndexes.has(index);
      const answerId = `product-faq-answer-${instanceId}-${index}`;
      return (
        <div className="lp-faq-item" role="listitem" key={faq.question}>
          <button className="lp-faq-btn" type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenIndexes((current) => {
            const next = new Set(current);
            if (next.has(index)) next.delete(index); else next.add(index);
            return next;
          })}>
            <span>{faq.question}</span>
            <span className="lp-faq-icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
          </button>
          <div className="lp-faq-body" id={answerId} aria-hidden={!isOpen} data-open={isOpen || undefined}>
            <p>{faq.answer}</p>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="lp-faq-grid" role="list">
      {columns.map((column, columnIndex) => <div className="lp-faq-column" key={columnIndex}>{renderColumn(column, columnIndex)}</div>)}
    </div>
  );
}
