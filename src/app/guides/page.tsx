import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { Disclaimer } from "@/components/Disclaimer";
import { PROBLEM_GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/seo/routes";

export const metadata: Metadata = {
  title: "Specialist Lending Guides: Declined, Adverse Credit, Complex Income",
  description:
    "Plain-English guides for homeowners whose borrowing does not fit a standard mortgage: declined applications, CCJs and defaults, complex income, early repayment charges and second charge loans.",
  alternates: { canonical: "/guides" },
};

const EXISTING = [
  { href: "/second-charge-self-employed", title: "Second charge if you are self-employed or a company director" },
  { href: "/second-charge-vs-early-repayment-charge", title: "Second charge vs early repayment charge calculator and guide" },
  { href: "/help-to-buy-second-charge", title: "Second charge on a Help to Buy home" },
];

export default function Page() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
    ],
  };
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Specialist lending guides</h1>
      <p className="mt-3 text-[var(--bb-muted)]">
        Guides for borrowers whose situation does not fit a standard mortgage: a declined application, adverse credit,
        income that is hard for lenders to assess, or a fixed rate you do not want to leave. Each guide lists its
        sources, and the calculators on this site can put numbers on your own case.
      </p>

      <Section className="mt-8" title="Problem-led guides">
        <ul className="space-y-4">
          {PROBLEM_GUIDES.map((g) => (
            <li key={g.slug}>
              <Link href={`/${g.slug}`} className="text-sm font-semibold underline hover:text-[var(--bb-foreground)]">
                {g.title}
              </Link>
              <p className="mt-1 text-sm text-[var(--bb-muted)]">{g.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="mt-8" title="Second charge guides and calculators">
        <ul className="list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
          {EXISTING.map((e) => (
            <li key={e.href}>
              <Link href={e.href} className="underline hover:text-[var(--bb-foreground)]">
                {e.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/second-charge-calculator" className="underline hover:text-[var(--bb-foreground)]">
              Second charge calculator
            </Link>
          </li>
        </ul>
      </Section>

      <div className="mt-8">
        <Disclaimer>
          Information only. Lender criteria and rules change, so check the current position before applying. Your home
          may be repossessed if you do not keep up repayments on your mortgage or any other debt secured on it.
        </Disclaimer>
      </div>
    </div>
  );
}
