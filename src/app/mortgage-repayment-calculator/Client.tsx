"use client";

import { useMemo, useState } from "react";
import { calculateRepaymentPayment, calculateInterestOnlyPayment, calculateRateComparison, RepaymentType } from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput, SelectInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";

export default function RepaymentCalculatorClient() {
  const [loanAmount, setLoanAmount] = useState(200_000);
  const [rate, setRate] = useState(5.0);
  const [termYears, setTermYears] = useState(25);
  const [type, setType] = useState<RepaymentType>("repayment");

  const termMonths = termYears * 12;
  const repayment = useMemo(() => calculateRepaymentPayment({ loanAmount, annualInterestRatePercent: rate, termMonths }), [loanAmount, rate, termMonths]);
  const interestOnly = useMemo(() => calculateInterestOnlyPayment(loanAmount, rate), [loanAmount, rate]);
  const comparison = useMemo(() => calculateRateComparison(loanAmount, rate, termMonths, type), [loanAmount, rate, termMonths, type]);

  return (
    <CalculatorPage
      h1="Mortgage Repayment Calculator"
      intro="Calculate your monthly mortgage payment for repayment or interest-only, plus total interest over the term and a quick rate-rise comparison."
      disclaimer="Illustrative figures only. Your actual payment will depend on the exact product, fees and how interest is calculated by your lender."
      inputs={
        <Section title="Your mortgage">
          <div className="grid grid-cols-1 gap-3">
            <Field label="Loan amount">
              <NumberInput value={loanAmount} onChange={setLoanAmount} />
            </Field>
            <Field label="Interest rate (%)">
              <NumberInput value={rate} onChange={setRate} step={0.01} />
            </Field>
            <Field label="Term (years)">
              <NumberInput value={termYears} onChange={setTermYears} min={1} step={1} />
            </Field>
            <Field label="Repayment type">
              <SelectInput
                value={type}
                onChange={setType}
                options={[
                  { value: "repayment", label: "Repayment (capital & interest)" },
                  { value: "interest-only", label: "Interest-only" },
                ]}
              />
            </Field>
          </div>
        </Section>
      }
      results={
        <>
          <Section title="Results">
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Repayment monthly" value={formatGbp(repayment?.monthlyPayment)} accent="primary" />
              <StatTile label="Interest-only monthly" value={formatGbp(interestOnly)} />
              <StatTile label="Total interest" value={formatGbp(repayment?.totalInterest)} />
              <StatTile label="Total repaid" value={formatGbp(repayment?.totalRepaid)} />
            </div>
          </Section>
          <Section title="Rate comparison">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--bb-muted)]">
                    <th className="font-medium py-1 pr-4">Scenario</th>
                    <th className="font-medium py-1">Monthly payment</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((r) => (
                    <tr key={r.label} className="border-t border-[var(--bb-border)]">
                      <td className="py-1.5 pr-4">{r.label} ({formatPercent(r.ratePercent)})</td>
                      <td className="py-1.5">{formatGbp(r.monthlyPayment)}</td>
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
            A repayment mortgage pays down both interest and capital each month using standard
            amortisation, so the balance reaches zero at the end of the term. An interest-only
            mortgage only covers the interest — the capital balance stays the same and must be
            repaid separately at the end.
          </p>
        </>
      }
      faqs={[
        {
          question: "How is the monthly repayment calculated?",
          answer:
            "Using the standard amortisation formula based on loan amount, monthly interest rate and number of monthly payments.",
        },
        {
          question: "Why is interest-only cheaper per month?",
          answer:
            "Because none of the payment reduces the capital balance — you're only paying the interest due each month.",
        },
      ]}
    />
  );
}
