import type { Metadata } from "next";
import Link from "next/link";
import { ScenarioPicker } from "@/components/ScenarioPicker";
import { Section } from "@/components/Section";
import { getGroupedCalculators } from "@/lib/seo/calculators";

export const metadata: Metadata = {
  title: "Calculators for Mortgage Brokers and Packagers",
  description:
    "Free UK calculators for brokers: pick the kind of case and get the tools that fit it, or enter the case once and see LTV, repayments, loan-to-income, affordability and buy-to-let coverage together.",
  alternates: { canonical: "/for-brokers" },
};

export default function Page() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-6 sm:pt-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium" style={{ color: "var(--bb-primary)" }}>
            For brokers and packagers · Free · No account
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">What are you working on?</h1>
          <p className="mt-4 text-lg text-[var(--bb-muted)]">
            Choose the kind of case and we&apos;ll show only the tools that fit it, in the order you&apos;d usually use
            them.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-10">
        <ScenarioPicker />
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-10">
        <div className="bb-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-semibold">Prefer to enter the case once?</h2>
            <p className="mt-1 text-sm text-[var(--bb-muted)] max-w-2xl">
              The Mortgage Case Calculator takes the property and borrower details a single time and works out LTV,
              repayments, loan-to-income, affordability and buy-to-let coverage together.
            </p>
          </div>
          <Link
            href="/mortgage-case-calculator"
            className="bb-tap-target inline-flex shrink-0 items-center justify-center rounded-lg px-5 py-3 text-sm font-medium text-white"
            style={{ background: "var(--bb-primary)" }}
          >
            Open the Case Calculator
          </Link>
        </div>
      </section>

      <section id="all" className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 scroll-mt-24">
        <Section title="Every calculator">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {getGroupedCalculators().map(({ group, calculators }) => (
              <div key={group.id}>
                <h3 className="text-sm font-semibold">{group.title}</h3>
                <p className="mt-1 text-xs text-[var(--bb-muted)]">{group.blurb}</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {calculators.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/${c.slug}`} className="underline hover:text-[var(--bb-primary)]">
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </section>
    </div>
  );
}
