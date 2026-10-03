import type { ReactNode, SVGProps } from "react";
import { getStockState } from "@/app/utils/stockState";

function Icon({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>{children}</svg>;
}

export const TrashIcon = (props: SVGProps<SVGSVGElement>) => <Icon {...props}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" /></Icon>;
export const LockIcon = (props: SVGProps<SVGSVGElement>) => <Icon {...props}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Icon>;
export const ArrowIcon = (props: SVGProps<SVGSVGElement>) => <Icon {...props}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>;
export const CheckCircleIcon = (props: SVGProps<SVGSVGElement>) => <Icon {...props}><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></Icon>;
export const BagIcon = (props: SVGProps<SVGSVGElement>) => <Icon {...props}><path d="M6 7h12l1 14H5L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></Icon>;

/* Same glyphs the product cards use in the mattress catalogue. */
export function ProductFeatures({ turnable = true }: { turnable?: boolean }) {
  const features = [
    ["↻", turnable ? "Double-sided" : "Single-sided"],
    ["✣", "Hand-tufted"],
    ["▧", "Wire edge"],
    ["◇", "Approx. 26cm deep"],
  ];
  return <ul className="commerce-features">{features.map(([glyph, label]) => <li key={label}><i aria-hidden="true">{glyph}</i><span>{label}</span></li>)}</ul>;
}

export function StockNote({ count }: { count: number }) {
  const stock = getStockState(count);
  return <div className={`commerce-stock stock-${stock.tone}`}><p><i aria-hidden="true" /><strong>{stock.label}</strong></p>{stock.sub ? <small>{stock.sub}</small> : null}</div>;
}
