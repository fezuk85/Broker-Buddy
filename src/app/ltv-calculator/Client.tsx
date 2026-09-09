"use client";

import { useMemo, useState } from "react";
import { calculateLtv, calculateMaxLoanAtLtvBands } from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";

export default function LtvCalculatorClient() {
  const [propertyValue, setPropertyValue] = useState(300_000);
  const [currentBalance, setCurrentBalance] = useState(150_000);
  const [additionalBorrowing, setAdditionalBorrowing] = useState(0);

  const result = useMemo(
    () =>
      calculateLtv({
        propertyValue,
        currentMortgageBalance: currentBalance,
        additionalBorrowingRequired: additionalBorrowing,
      }),
    [propertyValue, currentBalance, additionalBorrowing]
  );

  const bands = useMemo(() => calculateMaxLoanAtLtvBands(propertyValue, currentBalance), [propertyValue, currentBalance]);

  return (
    <CalculatorPage
      h1="LTV Calculator"
      intro="Work out your current and proposed loan-to-value (LTV), equity, and how much extra you could borrow at each LTV band."
      disclaimer="Broker Buddy provides calculations only. LTV bands and lending limits vary by lender — always confirm with a lender or adviser."
      inputs={
        <Section title="Your details">
          <div className="grid grid-cols-1 gap-3">
            <Field label="Property value">
              <NumberInput value={propertyValue} onChange={setPropertyValue} />
            </Field>
            <Field label="Current mortgage balance">
              <NumberInput value={currentBalance} onChange={setCurrentBalance} />
            </Field>
            <Field label="Additional borrowing required">
              <NumberInput value={additionalBorrowing} onChange={setAdditionalBorrowing} />
            </Field>
          </div>
        </Section>
      }
      results={
        <>
          <Section title="Results">
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Current LTV" value={formatPercent(result.currentLtvPercent)} accent="primary" />
              <StatTile label="Proposed LTV" value={formatPercent(result.proposedLtvPercent)} accent="primary" />
              <StatTile label="Equity now" value={formatGbp(result.equity)} />
              <StatTile label="Equity after borrowing" value={formatGbp(result.equityAfterProposedBorrowing)} />
            </div>
          </Section>
          <Section title="Maximum loan by LTV band">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--bb-muted)]">
                    <th className="font-medium py-1 pr-4">LTV</th>
                    <th className="font-medium py-1 pr-4">Max loan</th>
                    <th className="font-medium py-1">Additional available</th>
                  </tr>
                </thead>
                <tbody>
                  {bands.map((b) => (
                    <tr key={b.ltvPercent} className="border-t border-[var(--bb-border)]">
                      <td className="py-1.5 pr-4">{b.ltvPercent}%</td>
                      <td className="py-1.5 pr-4">{formatGbp(b.maxLoan)}</td>
                      <td className="py-1.5">{formatGbp(b.additionalBorrowingAvailable)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </>
      }
      explanation={
        <>
          <p>
            Loan-to-value (LTV) is the size of a mortgage expressed as a percentage of the
            property&apos;s value: <strong>LTV = mortgage balance ÷ property value × 100</strong>.
          </p>
          <p>
            A lower LTV generally means access to better interest rates, because the lender is
            taking on less risk relative to the property&apos;s value. Equity is simply the
            property value minus what you owe.
          </p>
        </>
      }
      faqs={[
        {
          question: "What is a good LTV for a mortgage?",
          answer:
            "Many of the best rates are offered below 60% or 75% LTV, though products exist up to 95%. The exact bands and pricing vary by lender.",
        },
        {
          question: "How is additional borrowing available calculated?",
          answer:
            "It's the maximum loan at your chosen LTV band minus your current mortgage balance, floored at zero.",
        },
        {
          question: "Does this include fees added to the loan?",
          answer:
            "No — this calculator uses the balance and property value you enter. If fees are added to the loan, include them in your mortgage balance figure.",
        },
      ]}
    />
  );
}
