"use client";

import { CaseState, ApplicantInput } from "@/lib/case/types";
import { Section } from "@/components/Section";
import { Field, NumberInput, TextInput, DateInput, SelectInput } from "@/components/Field";

type Updater = (patch: Partial<CaseState> | ((prev: CaseState) => CaseState)) => void;

export function CaseInputs({ caseState, updateCase }: { caseState: CaseState; updateCase: Updater }) {
  const { property, applicants, household, mortgage, rental } = caseState;

  return (
    <div className="space-y-4">
      <Section title="Property">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Property value">
            <NumberInput value={property.value} onChange={(v) => updateCase((p) => ({ ...p, property: { ...p.property, value: v } }))} />
          </Field>
          <Field label="Postcode (optional)">
            <TextInput value={property.postcode} onChange={(v) => updateCase((p) => ({ ...p, property: { ...p.property, postcode: v } }))} />
          </Field>
          <Field label="Current mortgage balance">
            <NumberInput value={mortgage.currentBalance} onChange={(v) => updateCase((p) => ({ ...p, mortgage: { ...p.mortgage, currentBalance: v } }))} />
          </Field>
          <Field label="Additional borrowing required">
            <NumberInput value={mortgage.additionalBorrowing} onChange={(v) => updateCase((p) => ({ ...p, mortgage: { ...p.mortgage, additionalBorrowing: v } }))} />
          </Field>
        </div>
      </Section>

      <Section title="Borrower(s)">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Applicant 1 date of birth">
            <DateInput value={applicants.applicant1.dob} onChange={(v) => updateCase((p) => ({ ...p, applicants: { ...p.applicants, applicant1: { ...p.applicants.applicant1, dob: v } } }))} />
          </Field>
          <Field label="Applicant 1 gross annual income">
            <NumberInput value={applicants.applicant1.grossIncome} onChange={(v) => updateCase((p) => ({ ...p, applicants: { ...p.applicants, applicant1: { ...p.applicants.applicant1, grossIncome: v } } }))} />
          </Field>
        </div>
        {applicants.applicant2 ? (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Field label="Applicant 2 date of birth">
              <DateInput value={applicants.applicant2.dob} onChange={(v) => updateCase((p) => ({ ...p, applicants: { ...p.applicants, applicant2: { ...(p.applicants.applicant2 as ApplicantInput), dob: v } } }))} />
            </Field>
            <Field label="Applicant 2 gross annual income">
              <NumberInput value={applicants.applicant2.grossIncome} onChange={(v) => updateCase((p) => ({ ...p, applicants: { ...p.applicants, applicant2: { ...(p.applicants.applicant2 as ApplicantInput), grossIncome: v } } }))} />
            </Field>
            <button
              type="button"
              className="col-span-2 text-xs text-left text-[var(--bb-muted)] underline"
              onClick={() => updateCase((p) => ({ ...p, applicants: { ...p.applicants, applicant2: null } }))}
            >
              Remove applicant 2
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="mt-3 text-sm font-medium underline"
            style={{ color: "var(--bb-primary)" }}
            onClick={() => updateCase((p) => ({ ...p, applicants: { ...p.applicants, applicant2: { dob: "1990-01-01", grossIncome: 0 } } }))}
          >
            + Add applicant 2
          </button>
        )}
      </Section>

      <Section title="Household">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Number of adults">
            <NumberInput value={household.adults} onChange={(v) => updateCase((p) => ({ ...p, household: { ...p.household, adults: v } }))} min={0} step={1} />
          </Field>
          <Field label="Dependent children">
            <NumberInput value={household.dependentChildren} onChange={(v) => updateCase((p) => ({ ...p, household: { ...p.household, dependentChildren: v } }))} min={0} step={1} />
          </Field>
          <Field label="Monthly credit commitments">
            <NumberInput value={household.monthlyCreditCommitments} onChange={(v) => updateCase((p) => ({ ...p, household: { ...p.household, monthlyCreditCommitments: v } }))} />
          </Field>
          <Field label="Council tax (£/month, optional)">
            <NumberInput value={household.monthlyCouncilTax} onChange={(v) => updateCase((p) => ({ ...p, household: { ...p.household, monthlyCouncilTax: v } }))} />
          </Field>
        </div>
      </Section>

      <Section title="Mortgage">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Proposed interest rate (%)">
            <NumberInput value={mortgage.interestRatePercent} onChange={(v) => updateCase((p) => ({ ...p, mortgage: { ...p.mortgage, interestRatePercent: v } }))} step={0.01} />
          </Field>
          <Field label="Repayment type">
            <SelectInput
              value={mortgage.repaymentType}
              onChange={(v) => updateCase((p) => ({ ...p, mortgage: { ...p.mortgage, repaymentType: v } }))}
              options={[
                { value: "repayment", label: "Repayment (capital & interest)" },
                { value: "interest-only", label: "Interest-only" },
              ]}
            />
          </Field>
          <Field label="Requested term (years)">
            <NumberInput value={mortgage.termYears} onChange={(v) => updateCase((p) => ({ ...p, mortgage: { ...p.mortgage, termYears: v } }))} min={1} step={1} />
          </Field>
          <Field label="Lender max age assumption">
            <SelectInput
              value={String(mortgage.lenderMaxAge)}
              onChange={(v) => updateCase((p) => ({ ...p, mortgage: { ...p.mortgage, lenderMaxAge: Number(v) } }))}
              options={[70, 75, 80, 85].map((a) => ({ value: String(a), label: `${a}` }))}
            />
          </Field>
        </div>
      </Section>

      <Section title="Rental (for BTL)">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Monthly rent (£, optional)">
            <NumberInput value={rental.monthlyRent} onChange={(v) => updateCase((p) => ({ ...p, rental: { ...p.rental, monthlyRent: v } }))} />
          </Field>
          <Field label="Stress rate (%)">
            <NumberInput value={rental.stressRatePercent} onChange={(v) => updateCase((p) => ({ ...p, rental: { ...p.rental, stressRatePercent: v } }))} step={0.01} />
          </Field>
        </div>
      </Section>
    </div>
  );
}
