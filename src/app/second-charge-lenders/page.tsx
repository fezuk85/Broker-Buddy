import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { Disclaimer } from "@/components/Disclaimer";
import { LENDER_FACTS_CHECKED, LENDER_PROFILES } from "@/content/lenderFacts";

export const metadata: Metadata = {
  title: "Second Charge Lenders — Published Headline Facts, With Sources",
  description:
    "Headline facts on UK second charge lenders compiled from their own public pages and trade press, each with a source link and a date. Includes UTB, Together, Pepper Money, Selina, Interbridge, Step One, Central Trust and Shawbrook.",
  alternates: { canonical: "/second-charge-lenders" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Second charge lenders: published headline facts</h1>
      <p className="mt-3 text-[var(--bb-muted)]">
        What UK second charge lenders say publicly about loan sizes, loan-to-value and who they lend to, each with a
        source link and a date. Compiled on {LENDER_FACTS_CHECKED} from lenders&apos; own websites and trade press. It
        shows only information that is public, so it is a starting point and not a full criteria guide. Detailed
        criteria and rates are held by lenders and given to brokers directly.
      </p>

      <Section className="mt-8" title="At a glance">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--bb-muted)]">
                <th className="font-medium py-1 pr-3">Lender</th>
                <th className="font-medium py-1 pr-3">In one line</th>
                <th className="font-medium py-1 text-right">Facts</th>
              </tr>
            </thead>
            <tbody>
              {LENDER_PROFILES.map((l) => (
                <tr key={l.slug} className="border-t border-[var(--bb-border)] align-top">
                  <td className="py-1.5 pr-3 font-medium">
                    <a href={`#${l.slug}`} className="underline hover:text-[var(--bb-foreground)]">
                      {l.name}
                    </a>
                  </td>
                  <td className="py-1.5 pr-3 text-[var(--bb-muted)]">{l.summary}</td>
                  <td className="py-1.5 text-right tabular-nums">{l.facts.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {LENDER_PROFILES.map((l) => (
        <div key={l.slug} id={l.slug} className="scroll-mt-20">
        <Section className="mt-8" title={l.name}>
          <ul className="space-y-3">
            {l.facts.map((f) => (
              <li key={f.text} className="text-sm">
                <p>{f.text}</p>
                <p className="mt-0.5 text-xs text-[var(--bb-muted)]">
                  {f.sourceType} · {f.date} ·{" "}
                  <a href={f.source} target="_blank" rel="noopener noreferrer" className="underline">
                    source
                  </a>
                </p>
              </li>
            ))}
          </ul>
          {l.notConfirmed.length > 0 && (
            <div className="mt-3 text-xs text-[var(--bb-muted)]">
              <p className="font-medium">Not confirmed from public sources:</p>
              <ul className="list-disc pl-5 space-y-0.5">
                {l.notConfirmed.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>
        </div>
      ))}

      <p className="mt-8 text-sm text-[var(--bb-muted)]">
        Weighing a second charge against remortgaging? Try the{" "}
        <Link href="/second-charge-vs-early-repayment-charge" className="underline hover:text-[var(--bb-foreground)]">
          second charge vs early repayment charge calculator
        </Link>{" "}
        or read about{" "}
        <Link href="/second-charge-self-employed" className="underline hover:text-[var(--bb-foreground)]">
          second charge for the self-employed
        </Link>
        .
      </p>

      <div className="mt-6">
        <Disclaimer>
          Information only, compiled from public sources and not checked with the lenders. Lender criteria and products
          change often and some figures come from trade-press reports that may be out of date, so confirm current
          details with the lender or a qualified adviser. Nothing here is advice, a recommendation or an offer of credit.
          A second charge loan is secured on your home, so your home may be repossessed if you do not keep up repayments.
        </Disclaimer>
      </div>
    </div>
  );
}
