"use client";

import { useMemo, useState } from "react";
import { calculateIcrExamples, calculateMaxLoanFromRent } from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";

export default function BtlIcrCalculatorClient() {
  const [loanAmount, setLoanAmount] = useState(250_000);
  const [stressRate, setStressRate] = useState(5.5);
  const [monthlyRent, setMonthlyRent] = useState(1_300);

  const examples = useMemo(() => calculateIcrExamples(loanAmount, stressRate, monthlyRent || undefined), [loanAmount, stressRate, monthlyRent]);
  const maxLoan145 = useMemo(() => calculateMaxLoanFromRent(monthlyRent, stressRate, 145), [monthlyRent, stressRate]);
  const maxLoan125 = useMemo(() => calculateMaxLoanFromRent(monthlyRent, stressRate, 125), [monthlyRent, stressRate]);

  return (
    <CalculatorPage
      h1="BTL ICR Calculator"
      intro="Check buy-to-let interest coverage ratio (ICR) at 125% and 145%, the rent required, and the maximum loan your rent could support."
      disclaimer="Mathematical tool only, not lender criteria. Individual lenders set their own stress rates and ICR requirements."
      inputs={
        <Section title="Your details">
          <div className="grid grid-cols-1 gap-3">
            <Field label="Loan amount">
              <NumberInput value={loanAmount} onChange={setLoanAmount} />
            </Field>
            <Field label="Stress rate (%)">
              <NumberInput value={stressRate} onChange={setStressRate} step={0.01} />
            </Field>
            <Field label="Monthly rent (optional)">
              <NumberInput value={monthlyRent} onChange={setMonthlyRent} />
            </Field>
          </div>
        </Section>
      }
      results={
        <>
          <Section title="ICR examples">
            <div className="space-y-3">
              {examples.map((r) => (
                <div key={r.icrPercent} className="border-t border-[var(--bb-border)] pt-3 first:border-0 first:pt-0">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{r.icrPercent}% ICR</span>
                    <span>{formatGbp(r.requiredMonthlyRent)}/mo required</span>
                  </div>
                  {r.rentalCoveragePercent != null && (
                    <div className="text-xs text-[var(--bb-muted)] mt-1">
                      Coverage at entered rent: {formatPercent(r.rentalCoveragePercent)} ({r.passes ? "meets" : "below"} requirement)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
          <Section title="Maximum loan supported by rent">
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="At 125% ICR" value={formatGbp(maxLoan125)} />
              <StatTile label="At 145% ICR" value={formatGbp(maxLoan145)} />
            </div>
          </Section>
        </>
      }
      explanation={
        <p>
          ICR (interest coverage ratio) tests whether rental income covers the mortgage interest
          with a margin — typically at a stressed rate higher than the pay rate. Required rent =
          monthly stressed interest × ICR%.
        </p>
      }
      faqs={[
        {
          question: "What ICR do BTL lenders require?",
          answer:
            "Commonly 125%–145%, often higher for higher-rate taxpayers or limited company applications — this varies by lender.",
        },
        {
          question: "What is a stress rate?",
          answer:
            "A notional interest rate (usually higher than the actual pay rate) lenders use to test whether rent would still cover payments if rates rose.",
        },
      ]}
    />
  );
}
