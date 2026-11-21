import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { Disclaimer } from "@/components/Disclaimer";
import { BrokerCta } from "@/components/BrokerCta";
import { SITE_URL } from "@/lib/seo/routes";

export const metadata: Metadata = {
  title: "Second Charge on a Help to Buy Home — Repaying the Equity Loan",
  description:
    "Can you take out a second charge loan on a Help to Buy home, or use one to repay the equity loan? What the government's own guide says about the year-5 fee, repaying early and further borrowing.",
  alternates: { canonical: "/help-to-buy-second-charge" },
};

const faqs = [
  {
    question: "Can I get a second charge loan on a Help to Buy home?",
    answer:
      "Sometimes. The Help to Buy equity loan is itself secured by a second charge on your home, so a new lender would sit behind both your mortgage and the equity loan, and the government's guide says further borrowing needs the permission of Homes England's Mortgage Administrator. Only a minority of second charge lenders will lend on a Help to Buy home, so the choice is narrow.",
  },
  {
    question: "When do Help to Buy fees start?",
    answer:
      "The government's buyers' guide says that after five years you pay a fee of 1.75% a year of the equity loan amount at purchase, rising each year by the increase in the Retail Prices Index (RPI) plus 1%. There is also a £1 monthly management fee from the start.",
  },
  {
    question: "Can I repay part of my Help to Buy equity loan?",
    answer:
      "Yes. According to the guide, part repayments (called staircasing) can be made at any time and must be at least 10% of your home's current market value. The amount you repay depends on the value of the home at the time, assessed by an independent valuer whose cost you pay.",
  },
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Second charge on a Help to Buy home", item: `${SITE_URL}/help-to-buy-second-charge` },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
        Second charge on a Help to Buy home: repaying the equity loan or borrowing more
      </h1>
      <p className="mt-3 text-[var(--bb-muted)]">
        If you bought with a Help to Buy equity loan in England, the fee that starts after year five, or a need to
        borrow more, can leave you wondering whether a second charge loan is an option. This page sets out what the
        government&apos;s own homebuyer&apos;s guide says, and where a second charge fits. It is information, not
        advice.
      </p>

      <Section className="mt-8" title="How the equity loan is secured">
        <p className="text-sm text-[var(--bb-muted)]">
          The Help to Buy equity loan (England, 2013 to 2021) is secured on your home by a second charge in favour of
          Homes England, behind your main mortgage. That matters because any new second charge loan would sit behind
          both. Lenders are cautious about that, which is why only a minority of second charge lenders will consider a
          Help to Buy home at all.
        </p>
      </Section>

      <Section className="mt-8" title="The fee that starts after year five">
        <p className="text-sm text-[var(--bb-muted)]">
          The equity loan is interest-free for the first five years. After that the government&apos;s guide says you pay a
          fee of <strong>1.75% a year</strong> of the equity loan amount at the time you bought, and the fee then{" "}
          <strong>rises each year by the increase in RPI plus 1%</strong>. There is also a £1 monthly management fee
          from the start until the loan is repaid.
        </p>
        <div className="mt-3 rounded-lg border border-[var(--bb-border)] p-4 text-sm">
          <p className="font-medium">Example: a £40,000 equity loan</p>
          <p className="mt-1 text-[var(--bb-muted)]">
            1.75% of £40,000 is £700 a year, about £58 a month, plus the £1 management fee. The government guide gives
            about £59 a month for this size of loan in year six. After that the fee rises every year.
          </p>
        </div>
      </Section>

      <Section className="mt-8" title="Repaying the equity loan, in part or in full">
        <ul className="list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
          <li>
            Part repayments (staircasing) can be made at any time and must be at least{" "}
            <strong>10% of your home&apos;s current market value</strong>.
          </li>
          <li>
            What you repay is a share of the home&apos;s <strong>current value</strong>, not the original amount. If the
            property has gone up in value, the cost of repaying goes up with it.
          </li>
          <li>An independent valuer must value the property, and you pay for the valuation.</li>
          <li>Any outstanding fees must be paid at the same time.</li>
        </ul>
      </Section>

      <Section className="mt-8" title="Borrowing to repay it">
        <p className="text-sm text-[var(--bb-muted)]">
          People who want to clear the equity loan, or avoid the rising fee, usually look at three routes: remortgaging
          to a bigger mortgage, a further advance from their current lender, or a second charge loan. The guide says
          Homes England&apos;s Mortgage Administrator gives approval for requests for additional borrowing, and that
          increasing your first mortgage to fund a repayment of the equity loan needs its approval. Borrowing to repay
          the equity loan is described as something it will usually welcome, but each case is considered on its own
          facts.
        </p>
        <p className="mt-3 text-sm text-[var(--bb-muted)]">
          A second charge can help when your main mortgage has a low rate and an early repayment charge you would
          rather not trigger. Compare it with remortgaging using our{" "}
          <Link href="/second-charge-vs-early-repayment-charge" className="underline hover:text-[var(--bb-foreground)]">
            second charge vs early repayment charge calculator
          </Link>
          .
        </p>
      </Section>

      <Section className="mt-8" title="Questions to settle first">
        <ul className="list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
          <li>How much would it cost to repay the equity loan today, using a valuation?</li>
          <li>Will your first-charge lender agree to a second charge, or offer a further advance?</li>
          <li>Which second charge lenders will lend on a Help to Buy home, and on what conditions?</li>
          <li>What are the total costs, including fees and the interest rate, compared with simply paying the fee?</li>
        </ul>
        <p className="mt-3 text-sm text-[var(--bb-muted)]">
          A second charge is a loan secured on your home. If you do not keep up the payments, your home may be at risk.
          Speak to a qualified adviser who works with second charge lenders.
        </p>
      </Section>

      <Section className="mt-8" title="Common questions">
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.question}>
              <h3 className="text-sm font-semibold">{f.question}</h3>
              <p className="mt-1 text-sm text-[var(--bb-muted)]">{f.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-8">
        <BrokerCta />
      </div>

      <p className="mt-8 text-xs text-[var(--bb-muted)]">
        Source: the government&apos;s Homebuyers&apos; Guide to the Help to Buy equity loan (2013 to 2021) on gov.uk, last
        updated 16 March 2023, and gov.uk guidance on remortgaging a Help to Buy home. Rules and lender policies change,
        so check the current position with Homes England and the lender before acting.
      </p>
      <div className="mt-6">
        <Disclaimer>
          Information only. This page is not mortgage or financial advice and is not a recommendation to take out any
          loan. A second charge loan is secured on your home, so your home may be repossessed if you do not keep up
          repayments.
        </Disclaimer>
      </div>
    </div>
  );
}
