export type StockTone = "ok" | "low" | "last" | "out";

/** Count used for products that are in stock but whose quantity isn't tracked (e.g. WooCommerce without stock management). */
export const UNTRACKED_STOCK = 1000;

export function getStockState(count: number): { label: string; sub: string | null; tone: StockTone } {
  if (count <= 0) return { label: "Out of stock", sub: null, tone: "out" };
  return { label: "Available to order", sub: null, tone: "ok" };
}
