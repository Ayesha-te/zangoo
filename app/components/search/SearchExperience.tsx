"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { orthoMattressProducts } from "@/app/data/mattressProducts";

export function SearchExperience() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    return orthoMattressProducts.filter((product) =>
      `${product.name} ${product.shortName} ${product.description} ${product.firmness}`.toLowerCase().includes(value),
    );
  }, [query]);

  return (
    <div className="search-experience">
      <label className="search-page-input">
        <span>Search furniture</span>
        <input autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product name, firmness or keyword" />
      </label>
      {query.trim() ? (
        <div className="search-page-results" aria-live="polite">
          <p className="search-page-result-count">{results.length} result{results.length === 1 ? "" : "s"} found</p>
          <div className="search-page-grid">
            {results.map((product) => (
              <article className="search-page-card" key={product.slug}>
                <img src={product.image} alt={product.imageAlt} />
                <div><span>{product.firmness}</span><h2>{product.shortName}</h2><strong>{product.price.replace("Ã‚Â£", "Â£")}</strong><Link href={`/collections/bedroom/mattresses/${product.slug}/`}>View item</Link></div>
              </article>
            ))}
          </div>
          {!results.length ? <p className="search-page-empty">No furniture matched your search.</p> : null}
        </div>
      ) : <p className="search-page-hint">Start typing to search our available mattresses.</p>}
    </div>
  );
}
