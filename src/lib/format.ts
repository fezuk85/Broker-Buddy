/** Shared display formatting helpers (GBP currency, percentages). */

export function formatGbp(value: number | null | undefined, decimals = 0): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number | null | undefined, decimals = 1): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(decimals)}%`;
}

export function formatMultiple(value: number | null | undefined, decimals = 2): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(decimals)}x`;
}

export function formatYearsMonths(years: number, months: number): string {
  const y = `${years} yr${years === 1 ? "" : "s"}`;
  const m = `${months} mo${months === 1 ? "" : "s"}`;
  if (months === 0) return y;
  if (years === 0) return m;
  return `${y} ${m}`;
}
