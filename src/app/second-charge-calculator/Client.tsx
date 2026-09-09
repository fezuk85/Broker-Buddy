"use client";

import { useMemo, useState } from "react";
import { calculateCombinedCharges, calculateSecuredLoanCost, ExistingCharge } from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput, SelectInput, TextInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";

type RepaymentType = "repayment" | "interest-only";

export default function SecondChargeCalculatorClient() {
  const [propertyValue, setPropertyValue] = useState(400_000);
  const [charges, setCharges] = useState<ExistingCharge[]>([
    { label: "1st charge (existing mortgage)", balance: 180_000 },
  ]);
  const [newChargeAmount, setNewChargeAmount] = useState(40_000);
  const [monthlyRate, setMonthlyRate] = useState(0.65);
  const [termMonths, setTermMonths] = useState(60);
  const [repaymentType, setRepaymentType] = useState<RepaymentType>("interest-only");
  const [lenderFee, setLenderFee] = useState(750);
  const [brokerFee, setBrokerFee] = useState(500);
  const [valuationFee, setValuationFee] = useState(250);

  const combined = useMemo(() => calculateCombinedCharges(propertyValue, charges, newChargeAmount), [propertyValue, charges, newChargeAmount]);

  const cost = useMemo(
    () =>
      calculateSecuredLoanCost({
        loanAmount: newChargeAmount,
        monthlyInterestRatePercent: monthlyRate,
        termMonths,
        repaymentType,
        lenderFee,
        brokerFee,
        valuationFee,
        otherFees: 0,
      }),
    [newChargeAmount, monthlyRate, termMonths, repaymentType, lenderFee, brokerFee, valuationFee]
  );

  function updateCharge(index: number, patch: Partial<ExistingCharge>) {
    setCharges((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  function addCharge() {
    setCharges((prev) => [...prev, { label: `${ordinal(prev.length + 1)} charge`, balance: 0 }]);
  }

  function removeCharge(index: number) {
    setCharges((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <CalculatorPage
      h1="Second & Third Charge Loan Calculator"
      intro="For loans secured behind an existing mortgage (or an existing second charge): see the combined LTV across all charges, the new loan's monthly cost, and total cost including typical secured-loan fees."
      disclaimer="Generic maths only — not specific to any lender's criteria, product or APRC. Second/third charge lending criteria (maximum combined LTV, consent from the prior charge holder, etc.) vary by lender. Always confirm with the lender's own illustration."
      inputs={
        <>
          <Section title="Property & existing charges">
            <Field label="Property value">
              <NumberInput value={propertyValue} onChange={setPropertyValue} />
            </Field>
            <div className="mt-4 space-y-3">
              {charges.map((c, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                  <Field label={i === 0 ? "Charge label" : ""}>
                    <TextInput value={c.label} onChange={(v) => updateCharge(i, { label: v })} />
                  </Field>
                  <Field label={i === 0 ? "Balance" : ""}>
                    <NumberInput value={c.balance} onChange={(v) => updateCharge(i, { balance: v })} />
                  </Field>
                  <button
                    type="button"
                    onClick={() => removeCharge(i)}
                    className="bb-tap-target text-sm text-[var(--bb-muted)] underline px-2"
                    aria-label={`Remove ${c.label}`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addCharge} className="mt-3 text-sm font-medium underline" style={{ color: "var(--bb-primary)" }}>
              + Add another existing charge
            </button>
          </Section>

          <Section title="New charge requested" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="New loan amount">
                <NumberInput value={newChargeAmount} onChange={setNewChargeAmount} />
              </Field>
              <Field label="Monthly interest rate (%)">
                <NumberInput value={monthlyRate} onChange={setMonthlyRate} step={0.01} />
              </Field>
              <Field label="Term (months)">
                <NumberInput value={termMonths} onChange={setTermMonths} min={1} step={1} />
              </Field>
              <Field label="Repayment type">
                <SelectInput
                  value={repaymentType}
                  onChange={setRepaymentType}
                  options={[
                    { value: "interest-only", label: "Interest-only" },
                    { value: "repayment", label: "Repayment (capital & interest)" },
                  ]}
                />
              </Field>
              <Field label="Lender fee">
                <NumberInput value={lenderFee} onChange={setLenderFee} />
              </Field>
              <Field label="Broker fee">
                <NumberInput value={brokerFee} onChange={setBrokerFee} />
              </Field>
              <Field label="Valuation fee">
                <NumberInput value={valuationFee} onChange={setValuationFee} />
              </Field>
            </div>
          </Section>
        </>
      }
      results={
        <>
          <Section title="Combined LTV">
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Current combined LTV" value={formatPercent(combined.currentCombinedLtvPercent)} />
              <StatTile label="Proposed combined LTV" value={formatPercent(combined.proposedCombinedLtvPercent)} accent="primary" />
              <StatTile label="Equity now" value={formatGbp(combined.equity)} />
              <StatTile label="Equity after new charge" value={formatGbp(combined.equityAfterNewCharge)} />
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--bb-muted)]">
                    <th className="font-medium py-1 pr-4">Charge</th>
                    <th className="font-medium py-1 pr-4">Balance</th>
                    <th className="font-medium py-1 pr-4">Cumulative</th>
                    <th className="font-medium py-1">Cumulative LTV</th>
                  </tr>
                </thead>
                <tbody>
                  {combined.existingCharges.map((row) => (
                    <tr key={row.label} className="border-t border-[var(--bb-border)]">
                      <td className="py-1.5 pr-4">{row.label}</td>
                      <td className="py-1.5 pr-4">{formatGbp(row.balance)}</td>
                      <td className="py-1.5 pr-4">{formatGbp(row.cumulativeBalance)}</td>
                      <td className="py-1.5">{formatPercent(row.cumulativeLtvPercent)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-[var(--bb-border)] font-medium">
                    <td className="py-1.5 pr-4">+ New charge</td>
                    <td className="py-1.5 pr-4">{formatGbp(newChargeAmount)}</td>
                    <td className="py-1.5 pr-4">{formatGbp(combined.totalProposedBalance)}</td>
                    <td className="py-1.5">{formatPercent(combined.proposedCombinedLtvPercent)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="New charge cost">
            {cost ? (
              <div className="grid grid-cols-2 gap-3">
                <StatTile label="Monthly payment" value={formatGbp(cost.monthlyPayment)} accent="primary" />
                <StatTile label="Total interest" value={formatGbp(cost.totalInterest)} />
                <StatTile label="Total fees" value={formatGbp(cost.totalFees)} />
                <StatTile label="Total cost of borrowing" value={formatGbp(cost.totalCostOfBorrowing)} />
              </div>
            ) : (
              <p className="text-sm text-[var(--bb-muted)]">Enter a valid loan amount, rate and term.</p>
            )}
          </Section>
        </>
      }
      explanation={
        <p>
          A second (or third) charge loan sits behind one or more existing charges secured on the
          same property. What matters for LTV purposes is the <strong>combined</strong> balance of
          everything secured against the property, not just the new loan — so the combined LTV
          builds up charge by charge, and lenders typically cap the maximum combined LTV they&apos;ll
          allow behind an existing charge.
        </p>
      }
      faqs={[
        {
          question: "What's the difference between a second charge and remortgaging?",
          answer:
            "A second charge loan sits alongside your existing first-charge mortgage rather than replacing it — useful when the existing mortgage has an attractive rate or early repayment charges that make remortgaging unattractive.",
        },
        {
          question: "Can you have a third charge?",
          answer:
            "Yes — this calculator supports any number of existing charges. Third charges are less common and typically only available from a smaller pool of specialist lenders.",
        },
        {
          question: "Does the existing lender need to consent?",
          answer:
            "Usually yes — the first-charge lender typically needs to provide consent (a Deed of Postponement or similar) before a second charge can be registered.",
        },
      ]}
    />
  );
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}
