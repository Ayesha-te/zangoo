export const FIRMNESS_TIERS = ["Medium to Firm", "Firm", "Extra Firm"] as const;

const FIRMNESS_PERCENT: Record<string, number> = {
  "Medium to Firm": 55,
  Firm: 75,
  "Extra Firm": 92,
};

export function getFirmnessPercent(firmness: string) {
  return FIRMNESS_PERCENT[firmness] ?? 60;
}

export function getFirmnessRank(firmness: string) {
  const index = FIRMNESS_TIERS.indexOf(firmness as (typeof FIRMNESS_TIERS)[number]);
  return index === -1 ? FIRMNESS_TIERS.length : index;
}

const FIRMNESS_COLORS: Record<string, string> = {
  Soft: "#9fcce8",
  Medium: "#6aa9d8",
  "Medium to Firm": "#3f82bd",
  Firm: "#245b88",
  "Extra Firm": "#153752",
};

export function getFirmnessColor(firmness: string) {
  return FIRMNESS_COLORS[firmness] ?? "#3f82bd";
}
