/**
 * Placeholder ad slot. No live advertising in the MVP — this just reserves layout space so a
 * real ad unit can be dropped in later without reflowing the page.
 */
export function AdSlot({ variant = "inline" }: { variant?: "inline" | "sidebar" }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-dashed border-[var(--bb-border)] text-xs text-[var(--bb-muted)] ${
        variant === "sidebar" ? "h-64 w-full" : "h-20 w-full"
      }`}
      aria-hidden="true"
    >
      Ad space (not active)
    </div>
  );
}
