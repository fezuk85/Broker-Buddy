import type { LucideIcon } from "lucide-react";

export function StatTile({
  label,
  value,
  subValue,
  accent = "default",
  icon: Icon,
}: {
  label: string;
  value: string;
  subValue?: string;
  accent?: "default" | "primary" | "warning";
  icon?: LucideIcon;
}) {
  const valueColor =
    accent === "primary" ? "text-[var(--bb-primary)]" : accent === "warning" ? "text-[#8a5b00]" : "text-[var(--bb-foreground)]";

  return (
    <div className="bb-card px-4 py-3 min-w-0">
      {Icon && (
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-full mb-2"
          style={{ background: "color-mix(in srgb, var(--bb-primary) 12%, transparent)", color: "var(--bb-primary)" }}
        >
          <Icon size={16} strokeWidth={2.25} />
        </span>
      )}
      <div className="text-xs font-medium uppercase tracking-wide text-[var(--bb-muted)]">{label}</div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums break-words ${valueColor}`}>{value}</div>
      {subValue && <div className="mt-0.5 text-xs text-[var(--bb-muted)] break-words">{subValue}</div>}
    </div>
  );
}
