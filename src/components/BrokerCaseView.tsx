import Link from "next/link";
import { Section } from "@/components/Section";
import { Disclaimer } from "@/components/Disclaimer";
import { BrokerCta } from "@/components/BrokerCta";
import { BROKER_CASES, type BrokerCase } from "@/content/brokerCases";
import { SITE_URL } from "@/lib/seo/routes";

export function BrokerCaseView({ item }: { item: BrokerCase }) {
  const others = BROKER_CASES.filter((c) => c.slug !== item.slug);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: item.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Broker cases", item: `${SITE_URL}/broker-cases` },
      { "@type": "ListItem", position: 3, name: item.title, item: `${SITE_URL}/broker-cases/${item.slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />

      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--bb-muted)]">For brokers and advisers</p>
      <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">{item.h1}</h1>
      <p className="mt-3 text-[var(--bb-muted)]">{item.description}</p>

      <Section className="mt-8" title="What brokers often assume">
        <p className="text-sm text-[var(--bb-muted)]">{item.assumption}</p>
      </Section>

      <Section className="mt-8" title="What can still work">
        <ul className="list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
          {item.whatCanWork.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Section>

      <Section className="mt-8" title="Evidence to send with the case">
        <ul className="list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
          {item.evidence.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Section>

      <Section className="mt-8" title="What usually stops it">
        <ul className="list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
          {item.whatStopsIt.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Section>

      <Section className="mt-8" title="Common questions">
        <div className="space-y-4">
          {item.faqs.map((f) => (
            <div key={f.question}>
              <h3 className="text-sm font-semibold">{f.question}</h3>
              <p className="mt-1 text-sm text-[var(--bb-muted)]">{f.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      {item.sources && (
        <p className="mt-6 text-xs text-[var(--bb-muted)]">
          Further reading:{" "}
          {item.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && " · "}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">
                {s.label}
              </a>
            </span>
          ))}
        </p>
      )}

      <Section className="mt-8" title="Have a case like this?">
        <p className="text-sm text-[var(--bb-muted)]">
          If you are a broker with a case that fits, get in touch and we can talk it through before you submit it.{" "}
          <Link href="/contact-us" className="underline hover:text-[var(--bb-foreground)]">
            Contact us
          </Link>
          .
        </p>
      </Section>

      <div className="mt-6">
        <BrokerCta />
      </div>

      <Section className="mt-8" title="More cases lenders often decline">
        <ul className="list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
          {others.map((c) => (
            <li key={c.slug}>
              <Link href={`/broker-cases/${c.slug}`} className="underline hover:text-[var(--bb-foreground)]">
                {c.h1}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <div className="mt-8">
        <Disclaimer>
          For brokers and advisers. General information about how some lenders approach certain cases, not a lending
          decision, a recommendation or advice to any consumer. Lender criteria differ and change, so confirm the
          current position with the lender before submitting a case.
        </Disclaimer>
      </div>
    </div>
  );
}
