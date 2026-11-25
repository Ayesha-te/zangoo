"use client";

import { useEffect } from "react";
import Link from "next/link";
import { getCardCopy, type MattressProduct } from "@/app/data/mattressProducts";
import { getFirmnessPercent } from "@/app/utils/firmness";
import styles from "./mattressCompareModal.module.css";

type MattressCompareModalProps = {
  products: [MattressProduct, MattressProduct];
  onClose: () => void;
};

export function MattressCompareModal({ products, onClose }: MattressCompareModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const rows: Array<{ label: string; render: (item: MattressProduct) => React.ReactNode }> = [
    {
      label: "Firmness",
      render: (item) => (
        <div className={styles.firmnessCell}>
          <span className={styles.firmnessBar}>
            <span style={{ width: `${getFirmnessPercent(item.firmness)}%` }} />
          </span>
          {item.firmness}
        </div>
      ),
    },
    { label: "Price", render: (item) => <strong>{item.price.replace("From ", "")}</strong> },
    { label: "Spring type", render: (item) => item.compareSpecs.springType },
    { label: "Comfort layers", render: (item) => item.compareSpecs.comfortLayer },
    { label: "Cover", render: (item) => item.compareSpecs.cover },
    { label: "Finish", render: (item) => getCardCopy(item.slug).finish },
    { label: "Depth", render: (item) => getCardCopy(item.slug).depth },
    { label: "Turnable", render: (item) => (item.compareSpecs.turnable ? "Yes" : "No") },
    // Weight row removed (client, 26/11/2026): weights are not confirmed.
    // Rating hidden for now (client, 14/11/2026): there are no per-mattress reviews yet.
    // { label: "Rating", render: () => <span className={styles.ratingCell}>&#9733;&#9733;&#9733;&#9733;&#9733; 4.8 (358)</span> },
  ];

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHead}>
          <h2 id="compare-modal-title">Mattress Comparison</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close comparison">
            &times;
          </button>
        </div>

        <div className={styles.productHeads}>
          {products.map((item) => (
            <div className={styles.productHead} key={item.slug}>
              <span className={styles.productVisual}>
                {/* The main product photo (the first gallery photo can be a bedroom scene). */}
                <img src={item.image} alt={item.imageAlt} />
              </span>
              <strong>{item.shortName}</strong>
              <small>{getCardCopy(item.slug).type}</small>
            </div>
          ))}
        </div>

        <div className={styles.specRows}>
          {rows.map((row) => (
            <div className={styles.specRow} key={row.label}>
              <span className={styles.specLabel}>{row.label}</span>
              {products.map((item) => (
                <span className={styles.specValue} key={item.slug}>
                  {row.render(item)}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.modalActions}>
          {products.map((item) => (
            <Link
              className={styles.viewButton}
              href={`/collections/bedroom/mattresses/${item.slug}/`}
              key={item.slug}
              onClick={onClose}
            >
              View {item.shortName}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
