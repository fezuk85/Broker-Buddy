export function StatTile({
  label,
  value,
  subValue,
  accent = "default",
}: {
  label: string;
  value: string;
  subValue?: string;
  accent?: "default" | "primary" | "warning";
}) {
  const valueColor =
    accent === "primary" ? "text-[var(--bb-primary)]" : accent === "warning" ? "text-[#8a5b00]" : "text-[var(--bb-foreground)]";

  return (
    <div className="bb-card px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-[var(--bb-muted)]">{label}</div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums ${valueColor}`}>{value}</div>
      {subValue && <div className="mt-0.5 text-xs text-[var(--bb-muted)]">{subValue}</div>}
    </div>
  );
}
