import { Zap, ShieldCheck, Users } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Instant results", detail: "All calculations update in real time." },
  { icon: ShieldCheck, title: "Built on real data", detail: "HM Land Registry, EPC and Council Tax — never fabricated." },
  { icon: Users, title: "A clearer picture", detail: "See the bigger financial picture, instantly." },
];

/** Decorative sidebar panel alongside the case calculator — no dead links to pages that don't exist yet. */
export function CaseCalculatorSidebar() {
  return (
    <div className="bb-card p-5 sm:sticky sm:top-24">
      <h2 className="text-base font-semibold">Tools for smarter lending decisions</h2>
      <p className="mt-1.5 text-sm text-[var(--bb-muted)]">
        Everything a broker needs to assess a case quickly, backed by real public data wherever possible.
      </p>
      <div className="mt-5 space-y-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex items-start gap-3">
            <span
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ background: "color-mix(in srgb, var(--bb-primary) 12%, transparent)", color: "var(--bb-primary)" }}
            >
              <f.icon size={16} strokeWidth={2.25} />
            </span>
            <div>
              <div className="text-sm font-medium">{f.title}</div>
              <div className="text-xs text-[var(--bb-muted)] mt-0.5">{f.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
