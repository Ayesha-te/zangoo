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
