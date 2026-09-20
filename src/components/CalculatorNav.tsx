import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getGroupedCalculators } from "@/lib/seo/calculators";

function GroupedLinks({ currentSlug }: { currentSlug?: string }) {
  return (
    <div className="space-y-5">
      {getGroupedCalculators().map(({ group, calculators }) => (
        <div key={group.id}>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--bb-muted)] mb-1.5 px-2">
            {group.title}
          </h3>
          <ul className="space-y-0.5">
            {calculators.map((c) => {
              const current = c.slug === currentSlug;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/${c.slug}`}
                    aria-current={current ? "page" : undefined}
                    className={`block rounded-lg px-2 py-1.5 text-sm ${
                      current
                        ? "font-medium text-[var(--bb-primary)] bg-[color-mix(in_srgb,var(--bb-primary)_10%,transparent)]"
                        : "text-[var(--bb-foreground)] hover:bg-[var(--bb-bg)]"
                    }`}
                  >
                    {c.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Grouped calculator list: a sticky sidebar on large screens, a collapsible list on small ones. */
export function CalculatorNav({ currentSlug }: { currentSlug?: string }) {
  return (
    <>
      <details className="lg:hidden bb-card mb-5 group">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium">
          All calculators
          <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
        </summary>
        <nav aria-label="All calculators" className="border-t border-[var(--bb-border)] p-3">
          <GroupedLinks currentSlug={currentSlug} />
        </nav>
      </details>
      <nav aria-label="All calculators" className="hidden lg:block sticky top-24 self-start">
        <Link
          href="/mortgage-case-calculator"
          className="mb-5 block rounded-lg px-3 py-2 text-sm font-medium text-white text-center"
          style={{ background: "var(--bb-primary)" }}
        >
          Case Calculator
        </Link>
        <GroupedLinks currentSlug={currentSlug} />
      </nav>
    </>
  );
}
