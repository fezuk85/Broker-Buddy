"use client";

import { useMemo, useState } from "react";
import { calculateChildBenefitWithCharge, calculateMarriageAllowance, BENEFITS_YEAR_LABEL } from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { Field, NumberInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";

/**
 * Reusable "household benefits" block for the salary/dividend calculators: Child Benefit (net
 * of the High Income Child Benefit Charge) and Marriage Allowance. `primaryIncome` is the
 * income already calculated on the host page (salary, or salary+dividends) — this component
 * only asks for the two extra household details these benefits actually depend on.
 */
export function BenefitsSection({ primaryIncome }: { primaryIncome: number }) {
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [partnerIncome, setPartnerIncome] = useState(0);

  const higherEarnerIncome = Math.max(primaryIncome, partnerIncome);
  const lowerEarnerIncome = Math.min(primaryIncome, partnerIncome);
  const hasPartner = partnerIncome > 0;

  const childBenefit = useMemo(
    () => calculateChildBenefitWithCharge(numberOfChildren, higherEarnerIncome),
    [numberOfChildren, higherEarnerIncome]
  );

  const marriageAllowance = useMemo(
    () => calculateMarriageAllowance(lowerEarnerIncome, higherEarnerIncome),
    [lowerEarnerIncome, higherEarnerIncome]
  );

  return (
    <>
      <Section title="Household benefits">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Number of dependent children">
            <NumberInput value={numberOfChildren} onChange={setNumberOfChildren} min={0} step={1} />
          </Field>
          <Field label="Partner's annual income (optional)" hint="Leave as 0 if not applicable">
            <NumberInput value={partnerIncome} onChange={setPartnerIncome} />
          </Field>
        </div>
        <p className="mt-2 text-xs text-[var(--bb-muted)]">
          {BENEFITS_YEAR_LABEL} rates. Child Benefit and Marriage Allowance are based on whichever
          partner earns more, not household income combined.
        </p>
      </Section>

      {numberOfChildren > 0 && (
        <Section title="Child Benefit">
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Gross annual" value={formatGbp(childBenefit.grossAnnualChildBenefit)} />
            <StatTile
              label="Net annual (after charge)"
              value={formatGbp(childBenefit.netAnnualChildBenefit)}
              accent={childBenefit.chargePercent > 0 ? "warning" : "primary"}
            />
          </div>
          {childBenefit.chargePercent > 0 && (
            <p className="mt-3 text-sm text-[var(--bb-muted)]">
              High Income Child Benefit Charge: {formatPercent(childBenefit.chargePercent, 0)} clawed back
              ({formatGbp(childBenefit.annualCharge)}/year) since the higher earner&apos;s income of{" "}
              {formatGbp(childBenefit.higherEarnerIncome)} is over £60,000.
            </p>
          )}
        </Section>
      )}

      {hasPartner && (
        <Section title="Marriage Allowance">
          {marriageAllowance.eligible ? (
            <>
              <StatTile label="Annual tax saving" value={formatGbp(marriageAllowance.annualTaxSaving)} accent="primary" />
              <p className="mt-3 text-sm text-[var(--bb-muted)]">
                The lower-earning partner can transfer {formatGbp(marriageAllowance.transferAmount)} of their
                Personal Allowance to the higher earner, saving {formatGbp(marriageAllowance.annualTaxSaving)}/year in
                tax.
              </p>
            </>
          ) : (
            <p className="text-sm text-[var(--bb-muted)]">Not eligible: {marriageAllowance.reason}</p>
          )}
        </Section>
      )}
    </>
  );
}
