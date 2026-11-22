import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PROBLEM_GUIDES } from "@/lib/guides";
import { TalkButton } from "@/components/TalkButton";

const POPULAR = [
  { href: "/second-charge-calculator", title: "Second charge calculator", desc: "Combined loan-to-value and the cost of borrowing more." },
  { href: "/second-charge-vs-early-repayment-charge", title: "Second charge vs early repayment charge", desc: "See which costs less when you are on a fixed rate." },
  { href: "/mortgage-affordability-calculator", title: "How much can I borrow?", desc: "Income, monthly cost and a stress-tested payment." },
  { href: "/ltv-calculator", title: "LTV calculator", desc: "Loan-to-value, equity and extra borrowing at a glance." },
  { href: "/mortgage-repayment-calculator", title: "Repayment calculator", desc: "Monthly cost for repayment or interest-only." },
  { href: "/stamp-duty-calculator", title: "Stamp duty calculator", desc: "England, Wales and Scotland rates." },
];

const FEATURED = [
  "mortgage-declined-what-next",
  "moving-home-keeping-old-house-to-rent",
  "can-i-borrow-more-on-my-mortgage",
  "just-changed-jobs-can-i-borrow-more",
  "remortgage-with-a-ccj-or-defaults",
  "rent-out-a-property-not-yet-let-finance",
  "second-charge-with-adverse-credit",
  "early-repayment-charge-options",
];

const STEPS = [
  { n: "1", title: "Find your situation", body: "Read the guide that matches what has happened, in plain English, with its sources." },
  { n: "2", title: "Put numbers on it", body: "Use a calculator to see what borrowing more would really cost you." },
  { n: "3", title: "Talk it through", body: "Email us a few details. We will point you to the right route: a standard broker if that suits you best, or a specialist if your case needs one." },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-8 sm:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium" style={{ color: "var(--bb-primary)" }}>
            Free · No account · UK homeowners
          </p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
            Struggling to get a mortgage or loan?
          </h1>
          <p className="mt-4 text-lg text-[var(--bb-muted)] max-w-2xl">
            Declined, adverse credit, self-employed, or stuck on a fixed rate with an early repayment charge. Find out
            what your options are, in plain English, before you apply anywhere.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#situations"
              className="bb-tap-target inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-white"
              style={{ background: "var(--bb-primary)" }}
            >
              Find my situation <ArrowRight size={15} strokeWidth={2.25} />
            </a>
            <TalkButton topic="Homepage hero" className="!bg-transparent border !text-[var(--bb-foreground)] border-[var(--bb-border)] hover:border-[var(--bb-primary)] px-5 py-3">
              Talk to us
            </TalkButton>
          </div>
        </div>
      </section>

      <section id="situations" className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 scroll-mt-24">
        <h2 className="text-xl font-semibold tracking-tight">What has happened?</h2>
        <p className="mt-1 text-sm text-[var(--bb-muted)]">Pick the guide closest to your situation. Each one lists its sources.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((slug) => PROBLEM_GUIDES.find((x) => x.slug === slug)).filter((g): g is (typeof PROBLEM_GUIDES)[number] => Boolean(g)).map((g) => (
            <Link key={g.slug} href={`/${g.slug}`} className="bb-card p-4 hover:border-[var(--bb-primary)] transition-colors">
              <p className="text-sm font-semibold leading-snug">{g.title}</p>
              <p className="mt-2 text-xs text-[var(--bb-muted)] line-clamp-3">{g.description}</p>
            </Link>
          ))}
        </div>
        <Link href="/guides" className="mt-4 inline-block text-sm font-medium underline" style={{ color: "var(--bb-primary)" }}>
          All guides →
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">
        <h2 className="text-xl font-semibold tracking-tight">How it works</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="bb-card p-5">
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ background: "var(--bb-primary)" }}
              >
                {s.n}
              </span>
              <p className="mt-3 font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-[var(--bb-muted)]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Popular calculators</h2>
          <Link href="/for-brokers#all" className="text-sm font-medium underline shrink-0" style={{ color: "var(--bb-primary)" }}>
            All calculators →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR.map((c) => (
            <Link key={c.href} href={c.href} className="bb-card p-4 hover:border-[var(--bb-primary)] transition-colors">
              <p className="text-sm font-semibold">{c.title}</p>
              <p className="mt-1 text-xs text-[var(--bb-muted)]">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">
        <div className="bb-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-semibold">Are you a broker or packager?</h2>
            <p className="mt-1 text-sm text-[var(--bb-muted)] max-w-2xl">
              Choose the kind of case and get the calculators that fit it, or enter the case once and see LTV,
              repayments, loan-to-income, affordability and buy-to-let coverage together.
            </p>
          </div>
          <Link
            href="/for-brokers"
            className="bb-tap-target inline-flex shrink-0 items-center justify-center rounded-lg px-5 py-3 text-sm font-medium text-white"
            style={{ background: "var(--bb-primary)" }}
          >
            Calculators for brokers
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="bb-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold">What Lending Calculator is — and isn&apos;t</h2>
          <p className="mt-3 text-sm text-[var(--bb-muted)] max-w-3xl">
            Lending Calculator is a calculation and information tool for homeowners, mortgage brokers and property
            professionals. It is <strong>not</strong> a lender and does not give a recommendation on its own. Every
            figure is either a transparent mathematical calculation from the numbers you enter, or clearly-labelled
            public/open data, never a fabricated estimate presented as fact.
          </p>
          <Link href="/data-sources" className="mt-4 inline-block text-sm font-medium underline" style={{ color: "var(--bb-primary)" }}>
            See exactly which data is real vs. illustrative →
          </Link>
        </div>
      </section>
    </div>
  );
}
