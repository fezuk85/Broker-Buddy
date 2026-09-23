"use client";

import { useMemo, useState } from "react";
import {
  calculateAffordability,
  calculateAffordabilityScenario,
  AFFORDABILITY_INCOME_MULTIPLES,
  STRESS_TEST_RATE_UPLIFT_PERCENT,
} from "@/lib/calc";
import { formatGbp, formatMultiple, formatPercent } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";
import { AffordabilityGuide } from "@/content/guides/affordability";

export default function AffordabilityCalculatorClient() {
  const [incomeApplicant1, setIncomeApplicant1] = useState(50_000);
  const [incomeApplicant2, setIncomeApplicant2] = useState(30_000);
  const [monthlyCommitments, setMonthlyCommitments] = useState(200);
  const [deposit, setDeposit] = useState(40_000);
  const [incomeMultiple, setIncomeMultiple] = useState(4.5);
  const [rate, setRate] = useState(5);
  const [termYears, setTermYears] = useState(25);

  const inputs = useMemo(
    () => ({
      incomeApplicant1,
      incomeApplicant2,
      monthlyCommitments,
      deposit,
      incomeMultiple,
      annualInterestRatePercent: rate,
      termYears,
    }),
    [incomeApplicant1, incomeApplicant2, monthlyCommitments, deposit, incomeMultiple, rate, termYears]
  );

  const result = useMemo(() => calculateAffordability(inputs), [inputs]);
  const scenarios = useMemo(
    () => AFFORDABILITY_INCOME_MULTIPLES.map((m) => calculateAffordabilityScenario(inputs, m)),
    [inputs]
  );

  return (
    <CalculatorPage
      slug="mortgage-affordability-calculator"
      h1="How Much Can I Borrow? Mortgage Affordability Calculator"
      intro="Estimate how much you could borrow from your income, the property price your deposit would support, and what the monthly payment might look like — including a stress test at a higher rate."
      disclaimer="An illustration of income multiples only — not a lending decision or offer. Lenders apply their own affordability assessments (commitments, dependants, stress rates), so the amount a lender will actually offer can be higher or lower."
      inputs={
        <Section title="Your details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Applicant 1 gross annual income">
              <NumberInput prefix="£" value={incomeApplicant1} onChange={setIncomeApplicant1} />
            </Field>
            <Field label="Applicant 2 gross annual income" hint="Leave at 0 for a single applicant">
              <NumberInput prefix="£" value={incomeApplicant2} onChange={setIncomeApplicant2} />
            </Field>
            <Field label="Monthly credit commitments" hint="Loans, credit cards, car finance">
              <NumberInput prefix="£" value={monthlyCommitments} onChange={setMonthlyCommitments} />
            </Field>
            <Field label="Deposit">
              <NumberInput prefix="£" value={deposit} onChange={setDeposit} />
            </Field>
            <Field label="Income multiple" hint="Typically 4x to 4.5x; up to 5.5x for some borrowers">
              <NumberInput value={incomeMultiple} onChange={setIncomeMultiple} step={0.25} />
            </Field>
            <Field label="Interest rate (%)">
              <NumberInput suffix="%" value={rate} onChange={setRate} step={0.05} />
            </Field>
            <Field label="Term (years)">
              <NumberInput suffix="years" value={termYears} onChange={setTermYears} step={1} />
            </Field>
          </div>
        </Section>
      }
      results={
        <>
          <Section title="Estimated borrowing">
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Maximum borrowing" value={formatGbp(result.maxLoan)} accent="primary" subValue={`${formatMultiple(incomeMultiple, 2)} income`} />
              <StatTile label="Property price supported" value={formatGbp(result.maxPropertyPrice)} subValue="loan + deposit" />
              <StatTile label="LTV" value={result.ltvPercent === null ? "—" : formatPercent(result.ltvPercent)} />
              <StatTile label="Monthly payment" value={formatGbp(result.monthlyPayment, 0)} subValue="repayment mortgage" />
              <StatTile
                label={`Stress test (+${STRESS_TEST_RATE_UPLIFT_PERCENT}%)`}
                value={formatGbp(result.stressedMonthlyPayment, 0)}
                subValue={`at ${(rate + STRESS_TEST_RATE_UPLIFT_PERCENT).toFixed(2)}%`}
              />
              <StatTile
                label="Payment + commitments"
                value={
                  result.paymentPlusCommitmentsToGrossIncomePercent === null
                    ? "—"
                    : formatPercent(result.paymentPlusCommitmentsToGrossIncomePercent)
                }
                subValue="of gross monthly income"
              />
            </div>
            {result.ltvPercent !== null && result.ltvPercent > 95 && (
              <p className="mt-3 text-sm" style={{ color: "var(--bb-warning-text)" }}>
                LTV above 95% is beyond what most lenders offer — a larger deposit would be needed.
              </p>
            )}
          </Section>

          <Section title="Different income multiples">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--bb-muted)]">
                  <th scope="col" className="font-medium py-1 pr-3">Multiple</th>
                  <th scope="col" className="font-medium py-1 pr-3">Max loan</th>
                  <th scope="col" className="font-medium py-1 pr-3">Property price</th>
                  <th scope="col" className="font-medium py-1 text-right">Monthly</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s) => (
                  <tr key={s.multiple} className="border-t border-[var(--bb-border)]">
                    <td className="py-1.5 pr-3">{formatMultiple(s.multiple, 1)}</td>
                    <td className="py-1.5 pr-3">{formatGbp(s.maxLoan)}</td>
                    <td className="py-1.5 pr-3">{formatGbp(s.maxPropertyPrice)}</td>
                    <td className="py-1.5 text-right">{formatGbp(s.monthlyPayment)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </>
      }
      explanation={
        <p>
          Maximum borrowing = combined gross income × income multiple. The property price it supports is the loan plus
          your deposit. The monthly payment is a standard capital-and-interest repayment over the term you choose, and
          the stress test re-runs it at a rate {STRESS_TEST_RATE_UPLIFT_PERCENT} percentage points higher to show how
          sensitive the payment is to rate rises.
        </p>
      }
      guide={<AffordabilityGuide />}
      faqs={[
        {
          question: "How much can I borrow on a £50,000 salary?",
          answer:
            "At 4.5 times income a single applicant on £50,000 could typically be offered around £225,000, with some lenders going higher or lower depending on commitments and their own affordability rules.",
        },
        {
          question: "Do lenders count both incomes on a joint mortgage?",
          answer:
            "Yes — joint applicants' incomes are normally combined, and each applicant is fully liable for the whole debt.",
        },
        {
          question: "Does the amount I can borrow depend on my debts?",
          answer:
            "Yes. Lenders deduct regular commitments such as loans, credit cards and car finance in their affordability assessment, so more existing debt generally means a lower offer.",
        },
        {
          question: "Why is there a stress test?",
          answer:
            "Lenders check you could still afford the payments if rates rose. The stress-test figure here shows the payment at a rate 3 percentage points higher as an illustration.",
        },
      ]}
    />
  );
}
