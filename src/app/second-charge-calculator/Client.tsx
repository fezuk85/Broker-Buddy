"use client";

import { useMemo, useState } from "react";
import {
  calculateCombinedCharges,
  calculateSecuredLoanCost,
  calculateCombinedDscr,
  calculateMaxSecondChargeLoanFromRent,
  ExistingCharge,
  LandlordTaxStatus,
  STANDARD_ICR_PERCENT_BY_TAX_STATUS,
} from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput, SelectInput, TextInput, DateInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";
import { FileDown } from "lucide-react";

type RepaymentType = "repayment" | "interest-only";

const TAX_STATUS_OPTIONS: { value: LandlordTaxStatus; label: string }[] = [
  { value: "basic-rate", label: "Basic rate taxpayer" },
  { value: "higher-additional-rate", label: "Higher / additional rate taxpayer" },
  { value: "limited-company", label: "Limited company" },
];

export default function SecondChargeCalculatorClient() {
  const [clientReference, setClientReference] = useState("");
  const [quotationDate, setQuotationDate] = useState("");
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const [propertyValue, setPropertyValue] = useState(400_000);
  const [charges, setCharges] = useState<ExistingCharge[]>([
    { label: "1st charge (existing mortgage)", balance: 180_000 },
  ]);
  const [newChargeAmount, setNewChargeAmount] = useState(40_000);
  const [annualRatePercent, setAnnualRatePercent] = useState(9.5);
  const [termMonths, setTermMonths] = useState(60);
  const [repaymentType, setRepaymentType] = useState<RepaymentType>("interest-only");
  const [lenderFee, setLenderFee] = useState(750);
  const [brokerFee, setBrokerFee] = useState(500);
  const [valuationFee, setValuationFee] = useState(250);
  const [otherFees, setOtherFees] = useState(0);

  const [isRental, setIsRental] = useState(false);
  const [firstChargePayment, setFirstChargePayment] = useState(900);
  const [monthlyRent, setMonthlyRent] = useState(1_600);
  const [taxStatus, setTaxStatus] = useState<LandlordTaxStatus>("basic-rate");
  const [requiredIcrPercent, setRequiredIcrPercent] = useState(STANDARD_ICR_PERCENT_BY_TAX_STATUS["basic-rate"]);

  function handleTaxStatusChange(status: LandlordTaxStatus) {
    setTaxStatus(status);
    setRequiredIcrPercent(STANDARD_ICR_PERCENT_BY_TAX_STATUS[status]);
  }

  const combined = useMemo(() => calculateCombinedCharges(propertyValue, charges, newChargeAmount), [propertyValue, charges, newChargeAmount]);

  // The calculation engine works in monthly rate terms (matching the bridging calculator's
  // convention); the second-charge market quotes rates annually, so convert at the boundary.
  const monthlyRateForCalc = annualRatePercent / 12;

  const cost = useMemo(
    () =>
      calculateSecuredLoanCost({
        loanAmount: newChargeAmount,
        monthlyInterestRatePercent: monthlyRateForCalc,
        termMonths,
        repaymentType,
        lenderFee,
        brokerFee,
        valuationFee,
        otherFees,
      }),
    [newChargeAmount, monthlyRateForCalc, termMonths, repaymentType, lenderFee, brokerFee, valuationFee, otherFees]
  );

  const combinedDscr = useMemo(
    () => calculateCombinedDscr(firstChargePayment, cost?.monthlyPayment ?? 0, monthlyRent, requiredIcrPercent),
    [firstChargePayment, cost, monthlyRent, requiredIcrPercent]
  );

  const maxSecondChargeLoanFromRent = useMemo(
    () => calculateMaxSecondChargeLoanFromRent(firstChargePayment, monthlyRent, requiredIcrPercent, monthlyRateForCalc),
    [firstChargePayment, monthlyRent, requiredIcrPercent, monthlyRateForCalc]
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

  async function handleDownloadPdf() {
    setGeneratingPdf(true);
    try {
      const { downloadSecondChargeQuotationPdf } = await import("@/lib/pdf/secondChargeQuotationPdf");
      downloadSecondChargeQuotationPdf({
        clientReference,
        quotationDate,
        propertyValue,
        charges,
        newChargeAmount,
        annualRatePercent,
        termMonths,
        repaymentType,
        lenderFee,
        brokerFee,
        valuationFee,
        otherFees,
        combined,
        cost,
        isRental,
        firstChargePayment,
        monthlyRent,
        requiredIcrPercent,
        combinedDscr,
        maxSecondChargeLoanFromRent,
      });
    } finally {
      setGeneratingPdf(false);
    }
  }

  return (
    <CalculatorPage
      h1="Second & Third Charge Loan Calculator"
      intro="For loans secured behind an existing mortgage (or an existing second charge): see the combined LTV across all charges, the new loan's monthly cost, and total cost including typical secured-loan fees."
      disclaimer="Generic maths only — not specific to any lender's criteria, product or APRC. Second/third charge lending criteria (maximum combined LTV, consent from the prior charge holder, etc.) vary by lender. Always confirm with the lender's own illustration."
      inputs={
        <>
          <Section title="Quotation details (optional)">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Client reference / surname">
                <TextInput value={clientReference} onChange={setClientReference} placeholder="e.g. Smith" />
              </Field>
              <Field label="Quotation date" hint="Defaults to today if left blank">
                <DateInput value={quotationDate} onChange={setQuotationDate} />
              </Field>
            </div>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={generatingPdf}
              className="bb-tap-target mt-3 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              style={{ background: "var(--bb-primary)" }}
            >
              <FileDown size={15} strokeWidth={2.25} />
              {generatingPdf ? "Generating…" : "Download PDF quotation"}
            </button>
          </Section>

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
              <Field label="Annual interest rate (%)">
                <NumberInput value={annualRatePercent} onChange={setAnnualRatePercent} step={0.01} />
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
              <Field label="Other fees" hint="e.g. application/booking fee, telegraphic transfer fee, exit fee">
                <NumberInput value={otherFees} onChange={setOtherFees} />
              </Field>
            </div>
          </Section>

          <Section title="Rental coverage (buy-to-let)" className="mt-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={isRental} onChange={(e) => setIsRental(e.target.checked)} className="h-4 w-4" />
              This is a buy-to-let / rental property
            </label>
            {isRental && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Field label="Existing 1st charge payment" hint="The actual monthly payment currently being made">
                  <NumberInput value={firstChargePayment} onChange={setFirstChargePayment} />
                </Field>
                <Field label="Monthly rent">
                  <NumberInput value={monthlyRent} onChange={setMonthlyRent} />
                </Field>
                <Field label="Borrower's tax position">
                  <SelectInput value={taxStatus} onChange={handleTaxStatusChange} options={TAX_STATUS_OPTIONS} />
                </Field>
                <Field label="Required ICR (%)" hint="Auto-filled — edit if the lender uses a different figure">
                  <NumberInput value={requiredIcrPercent} onChange={setRequiredIcrPercent} step={1} />
                </Field>
              </div>
            )}
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

          {isRental && (
            <Section title="Combined rental coverage (1st + 2nd charge)">
              <div className="grid grid-cols-2 gap-3">
                <StatTile label="Combined monthly payment" value={formatGbp(combinedDscr.monthlyPayment)} />
                <StatTile label="DSCR" value={formatPercent(combinedDscr.dscrPercent)} accent={combinedDscr.passes ? "primary" : "warning"} />
              </div>
              <p className="mt-3 text-sm">
                {combinedDscr.passes == null
                  ? "Enter the 1st charge payment and rent to check combined coverage."
                  : combinedDscr.passes
                    ? `✓ Rent covers both charges combined, meeting the ${requiredIcrPercent}% requirement with ${formatGbp(combinedDscr.surplusOrShortfall)}/mo to spare.`
                    : `✗ Rent does not cover both charges combined at the ${requiredIcrPercent}% requirement — short by ${formatGbp(-combinedDscr.surplusOrShortfall)}/mo.`}
              </p>
              <div className="mt-4 pt-4 border-t border-[var(--bb-border)]">
                <StatTile
                  label="Max 2nd charge loan this rent supports"
                  value={formatGbp(maxSecondChargeLoanFromRent)}
                  subValue="After accounting for the existing 1st charge payment, at the rate entered above"
                />
              </div>
            </Section>
          )}
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
        {
          question: "For a BTL 2nd charge, is rental coverage checked against just the new payment?",
          answer:
            "No — rent has to service the combined cost of the existing 1st charge plus the new 2nd charge, which is what the rental coverage section above checks, rather than looking at the 2nd charge payment in isolation.",
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
