import Link from "next/link";
import { getGroupedCalculators } from "@/lib/seo/calculators";

const CASE_OUTPUTS = [
  {
    title: "Mortgage",
    detail: "LTV and equity, maximum loan by LTV band, repayment and interest-only payments, total interest, fees.",
  },
  {
    title: "Property",
    detail: "HM Land Registry sale history and a clearly-labelled indicative estimate for the address.",
  },
  {
    title: "Affordability",
    detail: "Loan-to-income, income multiples and an illustrative household cash-flow snapshot.",
  },
  {
    title: "Rental",
    detail: "Gross rental yield and buy-to-let interest cover (ICR) for investment cases.",
  },
];

const STEPS = [
  { n: "1", title: "Enter the case once", detail: "Property, borrower(s), household, mortgage and any rental details." },
  { n: "2", title: "Read every result", detail: "Overview, Mortgage, Property, Affordability and Rental update as you type." },
  { n: "3", title: "Download a PDF summary", detail: "A one-file record of the case figures to keep or share." },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-10 sm:pt-20 sm:pb-12">
        <div className="max-w-2xl">
          <p className="text-sm font-medium" style={{ color: "var(--bb-primary)" }}>
            Free · No account · UK-focused
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            Enter the case once. See every figure.
          </h1>
          <p className="mt-4 text-lg text-[var(--bb-muted)]">
            The Mortgage Case Calculator takes your property and borrower details a single time and works out
            LTV, repayments, loan-to-income, affordability and buy-to-let coverage together, instead of
            re-entering the same numbers into a different calculator each time.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/mortgage-case-calculator"
              className="bb-tap-target inline-flex items-center rounded-lg px-5 py-3 text-sm font-medium text-white"
              style={{ background: "var(--bb-primary)" }}
            >
              Open the Case Calculator
            </Link>
            <a href="#calculators" className="text-sm font-medium underline" style={{ color: "var(--bb-primary)" }}>
              Or choose a single calculator
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-10" aria-labelledby="case-gives">
        <h2 id="case-gives" className="text-lg font-semibold">What the Case Calculator gives you</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CASE_OUTPUTS.map((o) => (
            <div key={o.title} className="bb-card p-5">
              <div className="font-medium">{o.title}</div>
              <div className="mt-1 text-sm text-[var(--bb-muted)]">{o.detail}</div>
            </div>
          ))}
        </div>
        <ol className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((s) => (
            <li key={s.n} className="flex items-start gap-3">
              <span
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ background: "var(--bb-primary)" }}
              >
                {s.n}
              </span>
              <span>
                <span className="block text-sm font-medium">{s.title}</span>
                <span className="block text-sm text-[var(--bb-muted)]">{s.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section id="calculators" className="mx-auto max-w-6xl px-4 sm:px-6 pb-10 scroll-mt-24" aria-labelledby="single-calcs">
        <h2 id="single-calcs" className="text-lg font-semibold">Or use a single calculator</h2>
        <p className="mt-1 text-sm text-[var(--bb-muted)]">Grouped by what you are working out.</p>
        <div className="mt-5 space-y-8">
          {getGroupedCalculators().map(({ group, calculators }) => (
            <div key={group.id}>
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <p className="text-sm text-[var(--bb-muted)]">{group.blurb}</p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {calculators.map((c) => (
                  <Link key={c.slug} href={`/${c.slug}`} className="bb-card p-5 hover:shadow-md transition-shadow">
                    <div className="font-medium">{c.title}</div>
                    <div className="mt-1 text-sm text-[var(--bb-muted)]">{c.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
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
