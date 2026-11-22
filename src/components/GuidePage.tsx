import Link from "next/link";
import { Section } from "@/components/Section";
import { Disclaimer } from "@/components/Disclaimer";
import { BrokerCta } from "@/components/BrokerCta";
import { EnquiryCta } from "@/components/EnquiryCta";
import { SITE_URL } from "@/lib/seo/routes";

export type GuideData = {
  slug: string;
  h1: string;
  intro: string;
  sections: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
  faqs: { q: string; a: string }[];
  related: string[];
  sources: { title: string; url: string; publisher: string }[];
};

const RELATED_LABELS: Record<string, string> = {
  "/second-charge-calculator": "Second charge calculator",
  "/second-charge-vs-early-repayment-charge": "Second charge vs early repayment charge calculator",
  "/second-charge-self-employed": "Second charge if you are self-employed or a company director",
  "/ltv-calculator": "Loan-to-value calculator",
  "/mortgage-affordability-calculator": "Mortgage affordability calculator",
  "/loan-to-income-calculator": "Loan-to-income calculator",
  "/mortgage-repayment-calculator": "Mortgage repayment calculator",
  "/help-to-buy-second-charge": "Second charge on a Help to Buy home",
  "/bridging-interest-calculator": "Bridging interest calculator",
};

export function GuidePage({ data }: { data: GuideData }) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
      { "@type": "ListItem", position: 3, name: data.h1, item: `${SITE_URL}/${data.slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />

      <p className="text-xs text-[var(--bb-muted)]">
        <Link href="/guides" className="underline hover:text-[var(--bb-foreground)]">
          Guides
        </Link>
      </p>
      <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">{data.h1}</h1>
      <p className="mt-3 text-[var(--bb-muted)]">{data.intro}</p>

      {data.sections.map((s) => (
        <Section key={s.heading} className="mt-8" title={s.heading}>
          {s.paragraphs?.map((p, i) => (
            <p key={i} className={`text-sm text-[var(--bb-muted)] ${i > 0 ? "mt-3" : ""}`}>
              {p}
            </p>
          ))}
          {s.bullets && s.bullets.length > 0 && (
            <ul className="mt-3 list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </Section>
      ))}

      {data.related.length > 0 && (
        <Section className="mt-8" title="Tools and guides that help">
          <ul className="list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
            {data.related.map((href) => (
              <li key={href}>
                <Link href={href} className="underline hover:text-[var(--bb-foreground)]">
                  {RELATED_LABELS[href] ?? href}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section className="mt-8" title="Common questions">
        <div className="space-y-4">
          {data.faqs.map((f) => (
            <div key={f.q}>
              <h3 className="text-sm font-semibold">{f.q}</h3>
              <p className="mt-1 text-sm text-[var(--bb-muted)]">{f.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-8">
        <EnquiryCta topic={data.h1} />
      </div>
      <div className="mt-8">
        <BrokerCta />
      </div>

      <Section className="mt-8" title="Sources">
        <ul className="list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
          {data.sources.map((s) => (
            <li key={s.url}>
              {s.publisher}:{" "}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--bb-foreground)]">
                {s.title}
              </a>
            </li>
          ))}
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
