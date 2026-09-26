import Link from "next/link";
import { Disclaimer } from "./Disclaimer";
import { BrokerCta } from "./BrokerCta";
import { CalculatorNav } from "./CalculatorNav";
import { CALCULATORS, getCalculator } from "@/lib/seo/calculators";
import { SITE_URL } from "@/lib/seo/routes";

export interface FaqItem {
  question: string;
  answer: string;
}

export function CalculatorPage({
  slug,
  h1,
  intro,
  inputs,
  results,
  explanation,
  guide,
  faqs,
  disclaimer,
}: {
  slug: string;
  h1: string;
  intro: string;
  inputs: React.ReactNode;
  results: React.ReactNode;
  explanation: React.ReactNode;
  /** Long-form guide content (headings, worked example) shown below "How this works". */
  guide?: React.ReactNode;
  faqs: FaqItem[];
  disclaimer: string;
}) {
  const info = getCalculator(slug);
  const related = (info?.related ?? [])
    .map((s) => CALCULATORS.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const pageUrl = `${SITE_URL}/${slug}`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: info?.title ?? h1, item: pageUrl },
    ],
  };
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: h1,
    url: pageUrl,
    description: intro,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage: "en-GB",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
      <aside>
        <CalculatorNav currentSlug={slug} />
      </aside>
      <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-3 text-xs text-[var(--bb-muted)]">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{info?.title ?? h1}</span>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{h1}</h1>
      <p className="mt-2 max-w-2xl text-[var(--bb-muted)]">{intro}</p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">{inputs}</div>
        <div className="space-y-4">{results}</div>
      </div>

      <div className="mt-4">
        <Disclaimer>{disclaimer}</Disclaimer>
      </div>

      <div className="mt-6 empty:hidden">
        <BrokerCta />
      </div>

      <div className="mt-10 bb-card p-5 sm:p-6 prose-sm max-w-none">
        <h2 className="text-base font-semibold mb-3">How this works</h2>
        <div className="text-sm text-[var(--bb-muted)] space-y-2">{explanation}</div>
      </div>

      {guide && <article className="mt-6 bb-card p-5 sm:p-6 guide-content">{guide}</article>}

      {faqs.length > 0 && (
        <div className="mt-6 bb-card p-5 sm:p-6">
          <h2 className="text-base font-semibold mb-3">Frequently asked questions</h2>
          <dl className="space-y-4">
            {faqs.map((f) => (
              <div key={f.question}>
                <dt className="text-sm font-medium">{f.question}</dt>
                <dd className="mt-1 text-sm text-[var(--bb-muted)]">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-6" aria-labelledby="related-calculators">
          <h2 id="related-calculators" className="text-base font-semibold mb-3">Related calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {related.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="bb-card p-4 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium">{c.title}</div>
                <div className="mt-1 text-xs text-[var(--bb-muted)]">{c.desc}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 text-sm">
        Want the full picture?{" "}
        <Link href="/mortgage-case-calculator" className="font-medium underline" style={{ color: "var(--bb-primary)" }}>
          Open the full Mortgage Case Calculator →
        </Link>
      </div>
      </div>
    </div>
  );
}
