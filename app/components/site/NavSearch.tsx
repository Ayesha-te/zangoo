"use client";

import { type CSSProperties, type RefObject, useMemo, useState } from "react";
import Link from "next/link";
import { orthoMattressProducts } from "@/app/data/mattressProducts";

type NavSearchProps = {
  open: boolean;
  top: number;
  inputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
};

export function NavSearch({ open, top, inputRef, onClose }: NavSearchProps) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const results = useMemo(() => {
    const terms = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return orthoMattressProducts.filter((product) => {
      const haystack = `${product.name} ${product.shortName} ${product.description} ${product.firmness} ${product.bestFor.join(" ")}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [trimmed]);

  const style = { "--nav-search-top": `${top}px` } as CSSProperties;

  return (
    <>
      <div className={`nav-search-backdrop${open ? " open" : ""}`} style={style} onClick={onClose} aria-hidden="true" />
      <div
        className={`nav-search${open ? " open" : ""}`}
        style={style}
        role="dialog"
        aria-modal="false"
        aria-label="Search products"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="nav-search-inner">
          <form className="nav-search-bar" role="search" onSubmit={(event) => event.preventDefault()}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-5-5m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by product name, firmness or keyword"
              aria-label="Search products"
              autoComplete="off"
            />
            <button type="button" className="nav-search-close" onClick={onClose} aria-label="Close search">
              &times;
            </button>
          </form>

          <div className={`nav-search-results${trimmed ? " open" : ""}`} aria-live="polite">
            <div className="nav-search-results-clip">
              <div className="nav-search-results-scroll">
                <p className="nav-search-count">
                  {results.length ? `${results.length} result${results.length === 1 ? "" : "s"} for “${trimmed}”` : `No products matched “${trimmed}”.`}
                </p>
                {results.length ? (
                  <div className="nav-search-grid">
                    {results.map((product) => (
                      <Link className="nav-search-card" href={`/collections/bedroom/mattresses/${product.slug}/`} key={product.slug} onClick={onClose}>
                        <img src={product.image} alt={product.imageAlt} loading="lazy" />
                        <span>{product.firmness}</span>
                        <strong>{product.shortName}</strong>
                        <small>{product.price}</small>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
