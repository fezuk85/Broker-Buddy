import Link from "next/link";
import { ScenarioPicker } from "@/components/ScenarioPicker";

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-6 sm:pt-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium" style={{ color: "var(--bb-primary)" }}>
            Free · No account · UK-focused
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">What are you working on?</h1>
          <p className="mt-4 text-lg text-[var(--bb-muted)]">
            Free UK mortgage and property calculators for brokers. Choose the kind of case and we&apos;ll show
            only the tools that fit it, in the order you&apos;d usually use them.
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
              The Mortgage Case Calculator takes the property and borrower details a single time and works out
              LTV, repayments, loan-to-income, affordability and buy-to-let coverage together.
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

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="bb-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold">What Lending Calculator is — and isn&apos;t</h2>
          <p className="mt-3 text-sm text-[var(--bb-muted)] max-w-3xl">
            Lending Calculator is a calculation and information tool for mortgage brokers, property
            professionals, landlords and consumers. It is <strong>not</strong> a mortgage advice
            platform, sourcing system or lender recommendation engine. Every figure is either a
            transparent mathematical calculation from the numbers you enter, or clearly-labelled
            public/open data — never a fabricated estimate presented as fact.
          </p>
          <Link href="/data-sources" className="mt-4 inline-block text-sm font-medium underline" style={{ color: "var(--bb-primary)" }}>
            See exactly which data is real vs. illustrative →
          </Link>
        </div>
      </section>
    </div>
  );
}
