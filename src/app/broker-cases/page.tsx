import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { Disclaimer } from "@/components/Disclaimer";
import { BROKER_CASES } from "@/content/brokerCases";

export const metadata: Metadata = {
  title: "Cases Lenders Often Decline — Second Charge Guides for Brokers",
  description:
    "Situations brokers are often told lenders will not do, and how some second charge lenders still approach them: newly limited companies, tax-efficient SA302s, Right to Buy properties and more.",
  alternates: { canonical: "/broker-cases" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--bb-muted)]">For brokers and advisers</p>
      <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">Cases lenders often decline, and what can still work</h1>
      <p className="mt-3 text-[var(--bb-muted)]">
        Short guides to situations brokers are commonly told will not work, and how some second charge lenders approach
        them, with the evidence to send and what usually stops the case.
      </p>
      <Section className="mt-8" title="The cases">
        <ul className="space-y-4">
          {BROKER_CASES.map((c) => (
            <li key={c.slug}>
              <Link href={`/broker-cases/${c.slug}`} className="font-medium underline hover:text-[var(--bb-foreground)]">
                {c.h1}
              </Link>
              <p className="mt-1 text-sm text-[var(--bb-muted)]">{c.description}</p>
            </li>
          ))}
        </ul>
      </Section>
      <div className="mt-8">
        <Disclaimer>
          For brokers and advisers. General information, not a lending decision, a recommendation or advice to any
          consumer. Lender criteria differ and change, so confirm the current position with the lender.
        </Disclaimer>
      </div>
    </div>
  );
}
