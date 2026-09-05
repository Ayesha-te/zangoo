export type StockTone = "ok" | "low" | "last" | "out";

export function getStockState(count: number): { label: string; sub: string | null; tone: StockTone } {
  if (count <= 0) return { label: "Out of stock", sub: null, tone: "out" };
  if (count === 1) return { label: "Last one — hurry!", sub: "Once it's gone, it's gone", tone: "last" };
  if (count <= 4) return { label: `Only ${count} left in stock`, sub: "Selling fast — order soon", tone: "low" };
  return { label: `${count} in stock`, sub: null, tone: "ok" };
}
