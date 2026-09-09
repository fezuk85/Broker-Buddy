import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";

const TOOLS = [
  { href: "/ltv-calculator", title: "LTV Calculator", desc: "Loan-to-value, equity and additional borrowing at a glance." },
  { href: "/mortgage-repayment-calculator", title: "Repayment Calculator", desc: "Monthly cost for repayment or interest-only mortgages." },
  { href: "/mortgage-term-age-calculator", title: "Age / Max Term Calculator", desc: "How age limits your maximum mortgage term." },
  { href: "/loan-to-income-calculator", title: "Loan-to-Income Calculator", desc: "See your borrowing as a multiple of income." },
  { href: "/btl-icr-calculator", title: "BTL ICR Calculator", desc: "Rental coverage and required rent at 125%/145%." },
  { href: "/rental-yield-calculator", title: "Rental Yield Calculator", desc: "Gross yield from purchase price and rent." },
  { href: "/bridging-interest-calculator", title: "Bridging Calculator", desc: "Retained or serviced interest, fees and total cost." },
  { href: "/second-charge-calculator", title: "Second & Third Charge Calculator", desc: "Combined LTV across all charges, plus new loan cost." },
  { href: "/salary-calculator", title: "Salary Take-Home Calculator", desc: "Income tax, National Insurance and net pay." },
  { href: "/dividend-calculator", title: "Salary + Dividend Calculator", desc: "Combined take-home for salary plus dividends." },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-10 sm:pt-20 sm:pb-14">
        <div className="max-w-2xl">
          <p className="text-sm font-medium" style={{ color: "var(--bb-primary)" }}>
            Free · No account · UK-focused
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            Every mortgage &amp; property calculation, in one place.
          </h1>
          <p className="mt-4 text-lg text-[var(--bb-muted)]">
            Enter your property and borrower details once, and get LTV, affordability
            illustrations, repayment figures, rental coverage and more — instantly, without
            repeating yourself across ten different calculators.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/mortgage-case-calculator"
              className="bb-tap-target inline-flex items-center rounded-lg px-5 py-3 text-sm font-medium text-white"
              style={{ background: "var(--bb-primary)" }}
            >
              Open the Case Calculator
            </Link>
            <Link
              href="/ltv-calculator"
              className="bb-tap-target inline-flex items-center rounded-lg px-5 py-3 text-sm font-medium border border-[var(--bb-border)]"
            >
              Try the LTV Calculator
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--bb-muted)] mb-4">
          Standalone calculators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="bb-card p-5 hover:shadow-md transition-shadow">
              <div className="font-medium">{t.title}</div>
              <div className="mt-1 text-sm text-[var(--bb-muted)]">{t.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <AdSlot />
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="bb-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold">What Broker Buddy is — and isn&apos;t</h2>
          <p className="mt-3 text-sm text-[var(--bb-muted)] max-w-3xl">
            Broker Buddy is a calculation and information tool for mortgage brokers, property
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
