import Link from "next/link";
import { Disclaimer } from "./Disclaimer";

export interface FaqItem {
  question: string;
  answer: string;
}

export function CalculatorPage({
  h1,
  intro,
  inputs,
  results,
  explanation,
  faqs,
  disclaimer,
}: {
  h1: string;
  intro: string;
  inputs: React.ReactNode;
  results: React.ReactNode;
  explanation: React.ReactNode;
  faqs: FaqItem[];
  disclaimer: string;
}) {
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{h1}</h1>
      <p className="mt-2 max-w-2xl text-[var(--bb-muted)]">{intro}</p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">{inputs}</div>
        <div className="space-y-4">{results}</div>
      </div>

      <div className="mt-4">
        <Disclaimer>{disclaimer}</Disclaimer>
      </div>

      <div className="mt-10 bb-card p-5 sm:p-6 prose-sm max-w-none">
        <h2 className="text-base font-semibold mb-3">How this works</h2>
        <div className="text-sm text-[var(--bb-muted)] space-y-2">{explanation}</div>
      </div>

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

      <div className="mt-8 text-sm">
        Want the full picture?{" "}
        <Link href="/mortgage-case-calculator" className="font-medium underline" style={{ color: "var(--bb-primary)" }}>
          Open the full Mortgage Case Calculator →
        </Link>
      </div>
    </div>
  );
}
