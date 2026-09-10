"use client";

import { CaseState } from "@/lib/case/types";
import { useCaseCalculations } from "@/lib/case/useCaseCalculations";
import { StatTile } from "@/components/StatTile";
import { Section } from "@/components/Section";
import { Disclaimer } from "@/components/Disclaimer";
import { formatGbp, formatPercent, formatMultiple, formatYearsMonths } from "@/lib/format";

type Calc = ReturnType<typeof useCaseCalculations>;

export function OverviewPanel({ calc }: { calc: Calc; caseState: CaseState }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatTile label="New loan" value={formatGbp(calc.ltv.totalProposedBorrowing)} accent="primary" />
        <StatTile label="Proposed LTV" value={formatPercent(calc.ltv.proposedLtvPercent)} accent="primary" />
        <StatTile label="Loan-to-income" value={formatMultiple(calc.lti)} />
        <StatTile
          label="Monthly payment"
          value={formatGbp(calc.monthlyMortgagePayment)}
          subValue={calc.ltv.totalProposedBorrowing > 0 ? undefined : "Enter loan details"}
        />
        <StatTile label="Equity" value={formatGbp(calc.ltv.equity)} />
        <StatTile label="Current LTV" value={formatPercent(calc.ltv.currentLtvPercent)} />
      </div>
      <Disclaimer>
        Lending Calculator provides calculations and indicative information only. It does not provide
        mortgage advice, lending decisions or property valuations.
      </Disclaimer>
    </div>
  );
}

export function MortgagePanel({ calc, caseState }: { calc: Calc; caseState: CaseState }) {
  return (
    <div className="space-y-4">
      <Section title="Loan-to-value & equity">
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Current LTV" value={formatPercent(calc.ltv.currentLtvPercent)} />
          <StatTile label="Proposed LTV" value={formatPercent(calc.ltv.proposedLtvPercent)} />
          <StatTile label="Equity now" value={formatGbp(calc.ltv.equity)} />
          <StatTile label="Equity after borrowing" value={formatGbp(calc.ltv.equityAfterProposedBorrowing)} />
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
              {calc.maxLoanBands.map((b) => (
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

      <Section title="Income multiples (illustrative)">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {calc.incomeMultiples.map((m) => (
            <StatTile key={m.multiple} label={`${m.multiple}x income`} value={formatGbp(m.maxBorrowing)} />
          ))}
        </div>
        <p className="mt-3 text-xs text-[var(--bb-muted)]">
          Income multiples are mathematical illustrations only. Lender affordability criteria vary.
        </p>
      </Section>

      <Section title="Age & term">
        <div className="grid grid-cols-2 gap-3">
          <StatTile
            label="Applicant 1 age"
            value={calc.applicant1Age ? formatYearsMonths(calc.applicant1Age.years, calc.applicant1Age.months) : "—"}
          />
          {caseState.applicants.applicant2 && (
            <StatTile
              label="Applicant 2 age"
              value={calc.applicant2Age ? formatYearsMonths(calc.applicant2Age.years, calc.applicant2Age.months) : "—"}
            />
          )}
          <StatTile
            label="Age at end of term"
            value={calc.ageAtEndOfTerm ? formatYearsMonths(calc.ageAtEndOfTerm.years, calc.ageAtEndOfTerm.months) : "—"}
            subValue="Oldest applicant, unless changed"
          />
          <StatTile
            label={`Max term (lender max age ${caseState.mortgage.lenderMaxAge})`}
            value={calc.maxTermAtSelectedLenderAge ? formatYearsMonths(Math.floor(calc.maxTermAtSelectedLenderAge.maxTermMonths / 12), calc.maxTermAtSelectedLenderAge.maxTermMonths % 12) : "—"}
          />
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--bb-muted)]">
                <th className="font-medium py-1 pr-4">Lender max age</th>
                <th className="font-medium py-1">Max term available</th>
              </tr>
            </thead>
            <tbody>
              {calc.maxTermsByLenderAge.map((r) => (
                <tr key={r.lenderMaxAge} className="border-t border-[var(--bb-border)]">
                  <td className="py-1.5 pr-4">{r.lenderMaxAge}</td>
                  <td className="py-1.5">{formatYearsMonths(Math.floor(r.maxTermMonths / 12), r.maxTermMonths % 12)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-[var(--bb-muted)]">
          Maximum ages and mortgage terms vary by lender and individual circumstances.
        </p>
      </Section>

      <Section title="Payment">
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Repayment (C&I) monthly" value={formatGbp(calc.repayment?.monthlyPayment)} />
          <StatTile label="Interest-only monthly" value={formatGbp(calc.interestOnlyPayment)} />
          <StatTile label="Total interest over term" value={formatGbp(calc.repayment?.totalInterest)} />
          <StatTile label="Total repaid" value={formatGbp(calc.repayment?.totalRepaid)} />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--bb-muted)]">
                <th className="font-medium py-1 pr-4">Rate scenario</th>
                <th className="font-medium py-1">Monthly payment</th>
              </tr>
            </thead>
            <tbody>
              {calc.rateComparison.map((r) => (
                <tr key={r.label} className="border-t border-[var(--bb-border)]">
                  <td className="py-1.5 pr-4">
                    {r.label} ({formatPercent(r.ratePercent)})
                  </td>
                  <td className="py-1.5">{formatGbp(r.monthlyPayment)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

export function PropertyPanel({ calc, caseState }: { calc: Calc; caseState: CaseState }) {
  const v = calc.valuation;
  return (
    <div className="space-y-4">
      <Section title="Property snapshot">
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Property value entered" value={formatGbp(caseState.property.value)} />
          <StatTile label="Postcode" value={caseState.property.postcode || "—"} />
        </div>
        <p className="mt-3 text-xs text-[var(--bb-muted)]">
          Sale history, address and tenure are shown below (HM Land Registry); floor area,
          EPC rating and construction age band are shown in the EPC section.
        </p>
      </Section>

      <Section title="HM Land Registry sale history">
        {calc.salesHistory?.sales.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--bb-muted)]">
                  <th className="font-medium py-1 pr-4">Date</th>
                  <th className="font-medium py-1 pr-4">Address</th>
                  <th className="font-medium py-1 pr-4">Price paid</th>
                  <th className="font-medium py-1">Type</th>
                </tr>
              </thead>
              <tbody>
                {calc.salesHistory.sales.slice(0, 10).map((s, i) => (
                  <tr key={`${s.saleDate}-${i}`} className="border-t border-[var(--bb-border)]">
                    <td className="py-1.5 pr-4">{s.saleDate}</td>
                    <td className="py-1.5 pr-4">{s.addressLine1}</td>
                    <td className="py-1.5 pr-4">{formatGbp(s.pricePaid)}</td>
                    <td className="py-1.5 capitalize">
                      {s.propertyType}
                      {s.newBuild ? " · new build" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-[var(--bb-muted)]">
            {calc.salesHistory?.sourceLabel ?? "Enter a postcode above to check for sale history."}
          </p>
        )}
        <p className="mt-3 text-xs text-[var(--bb-muted)]">
          Contains HM Land Registry data © Crown copyright and database right. Licensed under the
          Open Government Licence v3.0. Matched by postcode, not full address/UPRN — this is all
          sales recorded at this postcode, which may include neighbouring properties.
        </p>
      </Section>

      <Section title="Lending Calculator Indicative Property Estimate">
        {v.insufficientData ? (
          <p className="text-sm text-[var(--bb-muted)]">Insufficient data for a reliable indicative estimate.</p>
        ) : (
          <>
            <div className="space-y-1 text-sm">
              {v.methods.map((m) => (
                <div key={m.method} className="flex justify-between">
                  <span className="text-[var(--bb-muted)]">{m.label}</span>
                  <span className="font-medium">{formatGbp(m.estimate)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--bb-border)]">
              <StatTile label="Lending Calculator indicative estimate" value={formatGbp(v.combinedEstimate)} accent="primary" />
              <p className="mt-2 text-sm text-[var(--bb-muted)]">
                Range: {formatGbp(v.rangeLow)} – {formatGbp(v.rangeHigh)} · Confidence: {v.confidence}
              </p>
            </div>
          </>
        )}
        <p className="mt-3 text-xs text-[var(--bb-muted)]">
          Indicative estimate only. Not a formal valuation and should not be relied upon for
          lending, purchase or sale decisions.
        </p>
      </Section>
    </div>
  );
}

export function AffordabilityPanel({ calc }: { calc: Calc; caseState: CaseState }) {
  return (
    <div className="space-y-4">
      <Section title="Illustrative household cash-flow snapshot">
        {calc.affordability ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Net monthly income" value={formatGbp(calc.affordability.netMonthlyIncome)} />
              <StatTile
                label="Remaining after outgoings"
                value={formatGbp(calc.affordability.remainingAfterOutgoings)}
                accent={calc.affordability.remainingAfterOutgoings >= 0 ? "primary" : "warning"}
                subValue={
                  calc.affordability.outgoingsPercentOfNetIncome != null
                    ? `Outgoings are ${formatPercent(calc.affordability.outgoingsPercentOfNetIncome, 0)} of net income`
                    : undefined
                }
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatTile
                label="ONS benchmark expenditure"
                value={formatGbp(calc.affordability.monthlyExpenditure)}
                subValue={`per month · ${calc.expenditure?.estimate?.regionUsed ?? "UK average"}`}
              />
              <StatTile
                label="Council tax"
                value={calc.councilTax?.details ? formatGbp(calc.affordability.monthlyCouncilTax) : "—"}
                subValue={
                  calc.councilTax?.source === "modelled-illustrative" && calc.councilTax.details
                    ? `Estimated · Band ${calc.councilTax.details.band} typical for this area · ${calc.councilTax.details.localAuthority}`
                    : calc.councilTax?.source === "manual-entry"
                      ? "Entered manually"
                      : calc.councilTax === null
                        ? "Looking up estimate…"
                        : `No estimate available (${calc.councilTax.sourceLabel}) — enter a figure above`
                }
              />
              <StatTile label="Mortgage payment" value={formatGbp(calc.affordability.mortgagePayment)} subValue="per month" />
              <StatTile label="Credit commitments" value={formatGbp(calc.affordability.credit)} subValue="per month" />
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--bb-border)]">
              <StatTile label="Total indicative outgoings" value={formatGbp(calc.affordability.totalOutgoings)} accent="primary" subValue="per month" />
            </div>
          </>
        ) : (
          <p className="text-sm text-[var(--bb-muted)]">Enter household adults/children to see a benchmark.</p>
        )}
        <Disclaimer>
          This is an illustrative household cash-flow snapshot, not a lender affordability
          decision. Net income is estimated from gross income as if it were straightforward PAYE
          salary (no pension contributions, benefits, self-employment or other income). Lenders
          use their own affordability models, stress rates, expenditure assumptions, income
          verification and policy rules — a positive figure here is not a guarantee that any
          lender would approve this borrowing.
        </Disclaimer>
      </Section>

      {calc.expenditure?.estimate && (
        <Section title="ONS benchmark expenditure breakdown (monthly)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {Object.entries(calc.expenditure.estimate.monthlyBreakdown).map(([k, val]) => (
              <div key={k} className="border-b border-[var(--bb-border)] py-1">
                <div className="capitalize text-[var(--bb-muted)] text-xs">{k.replace(/([A-Z])/g, " $1")}</div>
                <div className="font-medium">{formatGbp(val as number)}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--bb-muted)]">
            Source: {calc.expenditure.sourceLabel}. Excludes: {calc.expenditure.estimate.excludedCategories.join(", ")}.
          </p>
          <p className="mt-1 text-xs text-[var(--bb-muted)]">
            Region: {calc.expenditure.estimate.regionUsed}
            {calc.expenditure.estimate.regionUsed === "UK average"
              ? " — enter a postcode above to use a region-adjusted benchmark instead."
              : " (derived from the postcode entered above; illustrative regional cost-of-living adjustment, not the official ONS regional breakdown)."}
          </p>
          <p className="mt-1 text-xs text-[var(--bb-muted)]">
            Household expenditure figures are statistical benchmarks and are not a substitute for
            actual expenditure assessment.
          </p>
        </Section>
      )}
    </div>
  );
}

export function RentalPanel({ calc, caseState }: { calc: Calc; caseState: CaseState }) {
  return (
    <div className="space-y-4">
      <Section title="Rental yield">
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Annual rent" value={formatGbp(calc.rentalYield.annualRent)} />
          <StatTile label="Gross yield" value={formatPercent(calc.rentalYield.grossYieldPercent)} />
        </div>
      </Section>

      <Section title="BTL interest coverage (ICR)">
        <div className="space-y-3">
          {calc.icrExamples.map((r) => (
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
        <div className="mt-4 pt-4 border-t border-[var(--bb-border)]">
          <StatTile
            label={`Max loan from rent at ${caseState.rental.icrPercent}% ICR`}
            value={formatGbp(calc.maxLoanFromRent)}
          />
        </div>
        <p className="mt-3 text-xs text-[var(--bb-muted)]">
          Mathematical tool only — not lender criteria. Individual lenders set their own stress
          rates and ICR requirements.
        </p>
      </Section>
    </div>
  );
}

export function EpcPanel({ calc, caseState }: { calc: Calc; caseState: CaseState }) {
  const cert = calc.epc?.certificate;

  return (
    <Section title="EPC data">
      {cert ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <StatTile
              label="Current EPC"
              value={cert.currentRating}
              subValue={cert.currentEnergyEfficiencyScore != null ? `Score: ${cert.currentEnergyEfficiencyScore}` : undefined}
            />
            <StatTile
              label="Potential EPC"
              value={cert.potentialRating}
              subValue={cert.potentialEnergyEfficiencyScore != null ? `Score: ${cert.potentialEnergyEfficiencyScore}` : undefined}
            />
            <StatTile label="Total floor area" value={cert.totalFloorAreaSqm ? `${cert.totalFloorAreaSqm} m²` : "—"} />
            <StatTile label="Property type" value={cert.propertyType || "—"} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-[var(--bb-muted)]">Construction age band</div>
              <div>{cert.constructionAgeBand ? `Code: ${cert.constructionAgeBand}` : "Not stated"}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--bb-muted)]">Main heating</div>
              <div>{cert.mainHeatingType ?? "Not stated"}</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--bb-muted)]">
            Certificate date: {cert.certificateDate}. Source: {calc.epc?.sourceLabel}. Matched by
            postcode only — at a postcode covering multiple flats this may not be the exact
            property. Construction age band is shown as the certificate&apos;s raw code, not yet
            decoded to a date range.
          </p>
        </>
      ) : caseState.property.postcode ? (
        <p className="text-sm text-[var(--bb-muted)]">{calc.epc?.sourceLabel ?? "Looking up EPC data..."}</p>
      ) : (
        <p className="text-sm text-[var(--bb-muted)]">
          Enter a property postcode to look up its current/potential EPC rating, floor area,
          construction age band and heating type from MHCLG&apos;s official EPC open data —
          floor area in particular improves the indicative property estimate via £/m²
          comparisons.
        </p>
      )}
    </Section>
  );
}
