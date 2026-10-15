export type StockTone = "ok" | "low" | "last" | "out";

/** Count used for products that are in stock but whose quantity isn't tracked (e.g. WooCommerce without stock management). */
export const UNTRACKED_STOCK = 1000;

export function getStockState(count: number): { label: string; sub: string | null; tone: StockTone } {
  if (count <= 0) return { label: "Out of stock", sub: null, tone: "out" };
  if (count === 1) return { label: "Last one — hurry!", sub: "Once it's gone, it's gone", tone: "last" };
  if (count <= 4) return { label: `Only ${count} left in stock`, sub: "Selling fast — order soon", tone: "low" };
  if (count >= UNTRACKED_STOCK) return { label: "In stock", sub: null, tone: "ok" };
  return { label: `${count} in stock`, sub: null, tone: "ok" };
}
