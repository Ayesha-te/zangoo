export type StockTone = "ok" | "low" | "last" | "out";

export function getStockState(count: number): { label: string; sub: string | null; tone: StockTone } {
  if (count <= 0) return { label: "Out of stock", sub: null, tone: "out" };
  return { label: "Available to order", sub: null, tone: "ok" };
}
