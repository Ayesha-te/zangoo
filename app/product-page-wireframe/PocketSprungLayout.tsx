// Pocket sprung range layout (client reference: mattressnextday.co.uk product page): tick-list and size boxes at
// the top, "Features you'll love" cards under the photos, and a "Features & Benefits" accordion with icons.
import type { ReactNode } from "react";
import { formatGBP } from "@/app/data/mattressProducts";
import styles from "./productPageWireframe.module.css";

export type MattressIconName = "springs" | "foam" | "firmness" | "depth" | "fabric" | "edge" | "cooling" | "uk" | "pillow" | "tuft" | "sided" | "box";

const ICON_PATHS: Record<MattressIconName, ReactNode> = {
  springs: (
    <>
      <rect x="6" y="6" width="36" height="7" rx="1.5" />
      <rect x="6" y="35" width="36" height="7" rx="1.5" />
      <path d="M12 13v22M24 13v22M36 13v22" strokeDasharray="0" opacity=".25" />
      <path d="M10 15c4 2 4 4 0 6s-4 4 0 6 4 4 0 6M22 15c4 2 4 4 0 6s-4 4 0 6 4 4 0 6M34 15c4 2 4 4 0 6s-4 4 0 6 4 4 0 6" />
    </>
  ),
  foam: (
    <>
      <path d="M6 26h36v14H6z" />
      <path d="M10 31h1M16 31h1M22 31h1M28 31h1M34 31h1M13 35h1M19 35h1M25 35h1M31 35h1M37 35h1" />
      <path d="M20 26c0-4 1-8 3-12l3-6c1-2 4-1 3 1l-2 6 7-4c2-1 3 1 2 3l-7 5" />
    </>
  ),
  firmness: (
    <>
      <path d="M18 14a6 6 0 1 1 12 0" />
      <path d="M14 16h20l3 8H11z" />
      <rect x="6" y="28" width="36" height="12" rx="2" />
      <path d="M10 34h4M17 34h4M24 34h4M31 34h4" />
    </>
  ),
  depth: (
    <>
      <rect x="10" y="6" width="12" height="36" rx="1.5" />
      <path d="M10 12h5M10 18h7M10 24h5M10 30h7M10 36h5" />
      <path d="M34 6v36M29 11l5-5 5 5M29 37l5 5 5-5" />
    </>
  ),
  fabric: (
    <>
      <path d="M8 10h32v28H8z" />
      <path d="M8 19h32M8 28h32M18 10v28M30 10v28" opacity=".7" />
      <path d="M13 14l1 1M24 14l1 1M35 14l1 1M13 23l1 1M24 23l1 1M35 23l1 1M13 32l1 1M24 32l1 1M35 32l1 1" />
    </>
  ),
  edge: (
    <>
      <rect x="6" y="14" width="36" height="20" rx="3" />
      <rect x="11" y="18" width="26" height="12" rx="1.5" strokeDasharray="3 3" />
      <path d="M6 24h5M37 24h5" />
    </>
  ),
  cooling: (
    <>
      <path d="M24 6v36M8.4 15l31.2 18M8.4 33l31.2-18" />
      <path d="M19 9l5 4 5-4M19 39l5-4 5 4M8 21l6-1-2-6M40 27l-6 1 2 6M8 27l6 1-2 6M40 21l-6-1 2-6" />
    </>
  ),
  uk: (
    <>
      <path d="M24 42s-14-9-14-21a14 14 0 0 1 28 0c0 12-14 21-14 21z" />
      <circle cx="24" cy="20" r="5" />
    </>
  ),
  pillow: (
    <>
      <path d="M8 20c0-5 4-8 16-8s16 3 16 8-4 8-16 8-16-3-16-8z" />
      <rect x="6" y="28" width="36" height="12" rx="2" />
    </>
  ),
  tuft: (
    <>
      <rect x="6" y="10" width="36" height="28" rx="3" />
      <circle cx="15" cy="19" r="1.6" />
      <circle cx="24" cy="19" r="1.6" />
      <circle cx="33" cy="19" r="1.6" />
      <circle cx="15" cy="29" r="1.6" />
      <circle cx="24" cy="29" r="1.6" />
      <circle cx="33" cy="29" r="1.6" />
    </>
  ),
  sided: (
    <>
      <rect x="6" y="22" width="36" height="12" rx="2" />
      <path d="M24 6v12M19 11l5-5 5 5" />
      <path d="M12 28h24" opacity=".5" />
    </>
  ),
  box: (
    <>
      <path d="M8 15l16-8 16 8v18l-16 8-16-8z" />
      <path d="M8 15l16 8 16-8M24 23v18" />
    </>
  ),
};

export function MattressIcon({ name, size = 48 }: { name: MattressIconName; size?: number }) {
  return (
    <svg className={styles.mattressIcon} viewBox="0 0 48 48" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}

/** Icon for a feature, from its wording (e.g. "Up to 2,000 pocket springs" → springs). */
function iconFor(title: string): MattressIconName {
  const t = title.toLowerCase();
  if (/gel|cool/.test(t)) return "cooling";
  if (/pillow/.test(t)) return "pillow";
  if (/memory|foam layer|foam comfort|foam layers|cushion/.test(t)) return "foam";
  if (/spring/.test(t)) return "springs";
  if (/edge|perimeter|encapsulat|sides/.test(t)) return "edge";
  if (/depth|cm/.test(t)) return "depth";
  if (/fabric|cover|knitted/.test(t)) return "fabric";
  if (/tuft/.test(t)) return "tuft";
  if (/single-sided|sided/.test(t)) return "sided";
  if (/uk|britain|handcrafted|made/.test(t)) return "uk";
  if (/firm|medium|feel|comfort/.test(t)) return "firmness";
  return "box";
}

/** "• <strong>Title</strong> - text" lines (the accordion content format) → rows. */
export function parseFeatureLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.match(/•\s*<strong>(.*?)<\/strong>\s*[-–]\s*(.*)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map(([, title, body]) => ({ title: title.trim(), body: body.trim(), icon: iconFor(title) }));
}

/** "Features & Benefits" accordion body: icon rows for the features, then the benefits. */
export function FeaturesAndBenefits({ features, benefits }: { features: string; benefits: string }) {
  const featureRows = parseFeatureLines(features);
  const benefitRows = parseFeatureLines(benefits);
  return (
    <div className={styles.featureRows}>
      {featureRows.map((row) => (
        <div className={styles.featureRow} key={row.title}>
          <MattressIcon name={row.icon} size={52} />
          <div>
            <strong>{row.title}</strong>
            <p>{row.body}</p>
          </div>
        </div>
      ))}
      {benefitRows.length ? (
        <>
          <h3 className={styles.benefitsTitle}>Benefits</h3>
          <ul className={styles.benefitList}>
            {benefitRows.map((row) => (
              <li key={row.title}>
                <strong>{row.title}</strong> – {row.body}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

export type LoveCard = { icon: MattressIconName; label: string; title: string; text: string };

/** "Features you'll love": three icon cards under the photos. */
export function FeaturesYoullLove({ cards }: { cards: LoveCard[] }) {
  return (
    <section className={styles.loveSection} aria-labelledby="love-title">
      <h2 id="love-title">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#3aa655" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a9 9 0 1 1-5.3-8.2M21 4 12 13l-3-3" />
        </svg>
        Features you&rsquo;ll love
      </h2>
      <div className={styles.loveGrid}>
        {cards.map((card) => (
          <div className={styles.loveCard} key={card.title}>
            <MattressIcon name={card.icon} size={64} />
            <small>{card.label}</small>
            <strong>{card.title}</strong>
            <p>{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Tick-list under the product name. */
export function QuickFacts({ facts }: { facts: string[] }) {
  return (
    <ul className={styles.quickFacts} role="list">
      {facts.map((fact) => (
        <li key={fact}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-5.3-8.2M21 4 12 13l-3-3" />
          </svg>
          {fact}
        </li>
      ))}
    </ul>
  );
}

const SIZE_FEET: Record<string, string> = { single: "3' x 6'3\"", double: "4'6\" x 6'3\"", king: "5' x 6'6\"" };
const SIZE_NAME: Record<string, string> = { single: "Single", double: "Double", king: "King Size" };

/** Size boxes with each size's price (replaces the size dropdown). */
export function SizeBoxes({
  sizes,
  selected,
  onSelect,
}: {
  sizes: Array<{ id: string; price: number; compare: number }>;
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className={styles.sizeBoxes} role="radiogroup" aria-label="Size">
      {sizes.map((option) => {
        const onSale = option.compare > option.price + 0.004;
        return (
          <button
            type="button"
            role="radio"
            aria-checked={selected === option.id}
            className={selected === option.id ? `${styles.sizeBox} ${styles.sizeBoxActive}` : styles.sizeBox}
            key={option.id}
            onClick={() => onSelect(option.id)}
          >
            <span className={styles.sizeBoxHead}>
              <strong>{SIZE_NAME[option.id] ?? option.id}</strong>
              <small>{SIZE_FEET[option.id]}</small>
            </span>
            <span className={styles.sizeBoxPrice}>
              <b>{formatGBP(option.price)}</b>
              {onSale ? <s>RRP {formatGBP(option.compare)}</s> : null}
            </span>
            <span className={styles.sizeBoxStock}><i aria-hidden="true" /> Available to order</span>
          </button>
        );
      })}
    </div>
  );
}
