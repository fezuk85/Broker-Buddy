import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { Disclaimer } from "@/components/Disclaimer";
import { BrokerCta } from "@/components/BrokerCta";
import { SITE_URL } from "@/lib/seo/routes";

export const metadata: Metadata = {
  title: "Second Charge Mortgage if You're Self-Employed or a Company Director",
  description:
    "How second charge lenders look at self-employed and limited company director income: what evidence you may need, how salary and dividends are treated, and what to prepare before you apply.",
  alternates: { canonical: "/second-charge-self-employed" },
};

const faqs = [
  {
    question: "Can I get a second charge loan if I am self-employed?",
    answer:
      "Often, yes, but lenders differ. Self-employed and company director borrowers can usually apply, and each lender sets its own rules on how long you must have been trading and how it works out your income. A broker who uses second charge lenders can tell you which are realistic for your situation.",
  },
  {
    question: "What proof of income do second charge lenders ask for?",
    answer:
      "Commonly your latest SA302 tax calculations and tax year overviews, and for company directors the company accounts, along with bank statements and proof of identity and address. The exact documents and the number of years vary by lender.",
  },
  {
    question: "Do lenders look at salary and dividends, or profit?",
    answer:
      "It depends on the lender. Some assess the salary and dividends you take as a director, and others may consider your share of the company's net profit. Because you control how you are paid, how you take income can affect what is assessed, so check before you apply.",
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
      { "@type": "ListItem", position: 2, name: "Second charge if you are self-employed", item: `${SITE_URL}/second-charge-self-employed` },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
        Second charge mortgage if you are self-employed or a company director
      </h1>
      <p className="mt-3 text-[var(--bb-muted)]">
        Working for yourself does not stop you borrowing against your home, but lenders assess your income differently
        from an employee&apos;s, so the evidence and the way you are paid both matter. This page explains how that usually
        works. It is information, not advice, and every lender has its own criteria.
      </p>

      <Section className="mt-8" title="How lenders usually look at self-employed income">
        <ul className="list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
          <li>
            <strong>Sole traders and partners:</strong> usually your net profit from your tax returns, often averaged over
            one or more years.
          </li>
          <li>
            <strong>Company directors:</strong> some lenders use your salary plus dividends, and others may look at your
            share of the company&apos;s net profit, so the way you pay yourself can change what is assessed.
          </li>
          <li>
            <strong>Time trading:</strong> lenders ask for a track record. How long varies by lender, so a newer business
            may suit some lenders and not others.
          </li>
        </ul>
      </Section>

      <Section className="mt-8" title="What you may need to provide">
        <ul className="list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
          <li>Your latest SA302 tax calculations and matching tax year overviews.</li>
          <li>For company directors, recent company accounts.</li>
          <li>Bank statements, and proof of identity and address.</li>
          <li>Details of your existing mortgage and what you plan to use the money for.</li>
        </ul>
        <p className="mt-3 text-sm text-[var(--bb-muted)]">
          Having everything ready, with figures that match across your tax records and accounts, usually makes an
          application smoother.
        </p>
      </Section>

      <Section className="mt-8" title="Why a second charge can come up for self-employed borrowers">
        <p className="text-sm text-[var(--bb-muted)]">
          A second charge is a separate loan secured behind your existing mortgage, from a different lender. Because it
          uses a different lender&apos;s criteria, it can sometimes be an option when changing your whole mortgage is not,
          for example if you have a good rate you do not want to lose. It is not suitable for everyone, it usually costs
          more than a first mortgage, and it puts your home at further risk if you cannot keep up repayments.
        </p>
      </Section>

      <Section className="mt-8" title="Tools that help">
        <p className="text-sm text-[var(--bb-muted)]">
          Directors can see how different salary and dividend splits affect take-home pay with our{" "}
          <Link href="/dividend-calculator" className="underline hover:text-[var(--bb-foreground)]">
            salary and dividend calculator
          </Link>
          , and check combined loan-to-value across all charges with the{" "}
          <Link href="/second-charge-calculator" className="underline hover:text-[var(--bb-foreground)]">
            second charge calculator
          </Link>
          . If you are weighing this against remortgaging, use the{" "}
          <Link href="/second-charge-vs-early-repayment-charge" className="underline hover:text-[var(--bb-foreground)]">
            second charge vs early repayment charge calculator
          </Link>
          .
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

      <div className="mt-8">
        <Disclaimer>
          Information only. This page is not mortgage or financial advice and is not a recommendation to take out any
          loan. A second charge loan is secured on your home, so your home may be repossessed if you do not keep up
          repayments. Lender criteria change, so check the current position before applying.
        </Disclaimer>
      </div>
    </div>
  );
}
