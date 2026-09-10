"use client";

import { useMemo, useState } from "react";
import {
  calculateDscr,
  calculateIcrExamples,
  calculateMaxLoanFromRent,
  LandlordTaxStatus,
  STANDARD_ICR_PERCENT_BY_TAX_STATUS,
} from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput, SelectInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";

type Mode = "actual" | "estimate";

const TAX_STATUS_OPTIONS: { value: LandlordTaxStatus; label: string }[] = [
  { value: "basic-rate", label: "Basic rate taxpayer" },
  { value: "higher-additional-rate", label: "Higher / additional rate taxpayer" },
  { value: "limited-company", label: "Limited company" },
];

export default function BtlIcrCalculatorClient() {
  const [mode, setMode] = useState<Mode>("actual");
  const [monthlyRent, setMonthlyRent] = useState(1_300);

  // "Actual payment" mode — the real DSCR check lenders do.
  const [monthlyPayment, setMonthlyPayment] = useState(1_000);
  const [taxStatus, setTaxStatus] = useState<LandlordTaxStatus>("basic-rate");
  const [requiredIcrPercent, setRequiredIcrPercent] = useState(STANDARD_ICR_PERCENT_BY_TAX_STATUS["basic-rate"]);

  function handleTaxStatusChange(status: LandlordTaxStatus) {
    setTaxStatus(status);
    setRequiredIcrPercent(STANDARD_ICR_PERCENT_BY_TAX_STATUS[status]);
  }

  const dscr = useMemo(() => calculateDscr(monthlyPayment, monthlyRent, requiredIcrPercent), [monthlyPayment, monthlyRent, requiredIcrPercent]);
  const maxMonthlyPayment = requiredIcrPercent > 0 ? monthlyRent / (requiredIcrPercent / 100) : null;

  // "Estimate" mode — early-stage illustration before a rate/payment is known.
  const [loanAmount, setLoanAmount] = useState(250_000);
  const [stressRate, setStressRate] = useState(5.5);
  const examples = useMemo(() => calculateIcrExamples(loanAmount, stressRate, monthlyRent || undefined), [loanAmount, stressRate, monthlyRent]);
  const maxLoan145 = useMemo(() => calculateMaxLoanFromRent(monthlyRent, stressRate, 145), [monthlyRent, stressRate]);
  const maxLoan125 = useMemo(() => calculateMaxLoanFromRent(monthlyRent, stressRate, 125), [monthlyRent, stressRate]);

  return (
    <CalculatorPage
      h1="BTL ICR / DSCR Calculator"
      intro="Check whether rental income covers the mortgage payment at the coverage ratio lenders require for the borrower's tax position — or estimate the maximum loan before a rate is quoted."
      disclaimer="Mathematical tool only, not lender criteria. Required ICR, stress rates and how the payment is calculated vary by lender — always confirm with the lender's own criteria."
      inputs={
        <Section title="Your details">
          <div className="mb-4 flex gap-1 rounded-lg border border-[var(--bb-border)] p-1">
            {(["actual", "estimate"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`bb-tap-target flex-1 rounded-md text-sm font-medium ${mode === m ? "text-white" : "text-[var(--bb-muted)]"}`}
                style={mode === m ? { background: "var(--bb-primary)" } : undefined}
              >
                {m === "actual" ? "Actual payment (DSCR)" : "Estimate from rate"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Field label="Monthly rent">
              <NumberInput value={monthlyRent} onChange={setMonthlyRent} />
            </Field>

            {mode === "actual" ? (
              <>
                <Field label="Monthly mortgage payment" hint="The actual (or lender-quoted) payment — not a notional stressed figure">
                  <NumberInput value={monthlyPayment} onChange={setMonthlyPayment} />
                </Field>
                <Field label="Borrower's tax position">
                  <SelectInput value={taxStatus} onChange={handleTaxStatusChange} options={TAX_STATUS_OPTIONS} />
                </Field>
                <Field label="Required ICR (%)" hint="Auto-filled from tax position above — edit if the lender uses a different figure">
                  <NumberInput value={requiredIcrPercent} onChange={setRequiredIcrPercent} step={1} />
                </Field>
              </>
            ) : (
              <>
                <Field label="Loan amount">
                  <NumberInput value={loanAmount} onChange={setLoanAmount} />
                </Field>
                <Field label="Stress rate (%)">
                  <NumberInput value={stressRate} onChange={setStressRate} step={0.01} />
                </Field>
              </>
            )}
          </div>
        </Section>
      }
      results={
        mode === "actual" ? (
          <>
            <Section title="Coverage check">
              <div className="grid grid-cols-2 gap-3">
                <StatTile label="DSCR" value={formatPercent(dscr.dscrPercent)} accent={dscr.passes ? "primary" : "warning"} />
                <StatTile label="Required rent" value={formatGbp(dscr.requiredMonthlyRent)} />
              </div>
              <p className="mt-3 text-sm">
                {dscr.passes == null
                  ? "Enter a monthly payment to check coverage."
                  : dscr.passes
                    ? `✓ Rent meets the ${requiredIcrPercent}% requirement, with ${formatGbp(dscr.surplusOrShortfall)}/mo to spare.`
                    : `✗ Rent falls short of the ${requiredIcrPercent}% requirement by ${formatGbp(-dscr.surplusOrShortfall)}/mo.`}
              </p>
            </Section>
            <Section title="Maximum payment this rent supports">
              <StatTile
                label={`Max monthly payment at ${requiredIcrPercent}% ICR`}
                value={formatGbp(maxMonthlyPayment)}
                subValue="Switch to Estimate mode with an interest rate to convert this into a loan amount"
              />
            </Section>
          </>
        ) : (
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
        )
      }
      explanation={
        <>
          <p>
            <strong>Actual payment (DSCR)</strong> is how lenders really check coverage: rent ÷
            actual mortgage payment, against a required percentage that depends on the borrower&apos;s
            tax position — 125% for basic-rate taxpayers and limited companies, 145% for
            individual higher/additional-rate taxpayers (since Section 24 restricts their
            mortgage interest tax relief, lenders require a bigger buffer).
          </p>
          <p>
            <strong>Estimate from rate</strong> is useful earlier on, before a specific product
            and payment are known — it works backwards from a loan amount and a notional stress
            rate instead.
          </p>
        </>
      }
      faqs={[
        {
          question: "Why does the required ICR depend on tax status?",
          answer:
            "Since April 2020, individual landlords can no longer deduct mortgage interest from rental profit before tax (Section 24) — they get a 20% tax credit instead. This hits higher/additional-rate taxpayers harder, so lenders typically require more rental cover from them (145% vs 125%) to compensate.",
        },
        {
          question: "For a 2nd charge loan, do I check DSCR against just the new payment?",
          answer:
            "No — rent has to service the combined cost of the existing 1st charge plus the new 2nd charge. See the Second & Third Charge Calculator, which includes this combined coverage check.",
        },
        {
          question: "What ICR do BTL lenders require?",
          answer: "Commonly 125%–145% as described above, but this varies by lender — always confirm with their current criteria.",
        },
      ]}
    />
  );
}
