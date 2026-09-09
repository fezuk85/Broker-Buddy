"use client";

import { useMemo, useState } from "react";
import { currentAge, ageAtTermEnd, calculateMaxTermsAcrossLenderAges } from "@/lib/calc";
import { formatYearsMonths } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, DateInput, NumberInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";

export default function AgeTermCalculatorClient() {
  const [dob, setDob] = useState("1990-01-01");
  const [termYears, setTermYears] = useState(25);

  const dobDate = useMemo(() => {
    const d = new Date(dob);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [dob]);

  const age = useMemo(() => (dobDate ? currentAge(dobDate) : null), [dobDate]);
  const ageAtEnd = useMemo(() => (dobDate ? ageAtTermEnd(dobDate, termYears * 12) : null), [dobDate, termYears]);
  const maxTerms = useMemo(() => (dobDate ? calculateMaxTermsAcrossLenderAges(dobDate) : []), [dobDate]);

  return (
    <CalculatorPage
      h1="Mortgage Age & Maximum Term Calculator"
      intro="See your current age, your age at the end of a chosen mortgage term, and the maximum term available under common lender maximum-age limits."
      disclaimer="Maximum ages and mortgage terms vary by lender and individual circumstances. This is a mathematical illustration only."
      inputs={
        <Section title="Your details">
          <div className="grid grid-cols-1 gap-3">
            <Field label="Date of birth">
              <DateInput value={dob} onChange={setDob} />
            </Field>
            <Field label="Requested term (years)">
              <NumberInput value={termYears} onChange={setTermYears} min={1} step={1} />
            </Field>
          </div>
        </Section>
      }
      results={
        <Section title="Results">
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Current age" value={age ? formatYearsMonths(age.years, age.months) : "—"} accent="primary" />
            <StatTile label="Age at end of term" value={ageAtEnd ? formatYearsMonths(ageAtEnd.years, ageAtEnd.months) : "—"} accent="primary" />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--bb-muted)]">
                  <th className="font-medium py-1 pr-4">Lender max age</th>
                  <th className="font-medium py-1">Max term available</th>
                </tr>
              </thead>
              <tbody>
                {maxTerms.map((r) => (
                  <tr key={r.lenderMaxAge} className="border-t border-[var(--bb-border)]">
                    <td className="py-1.5 pr-4">{r.lenderMaxAge}</td>
                    <td className="py-1.5">{formatYearsMonths(Math.floor(r.maxTermMonths / 12), r.maxTermMonths % 12)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      }
      explanation={
        <p>
          Lenders typically cap the mortgage term so the borrower is no older than a set maximum
          age (commonly 70–85) by the end of the term. This calculator works backwards from your
          date of birth to show the maximum term available under each common limit — for joint
          applications, use the oldest applicant&apos;s date of birth.
        </p>
      }
      faqs={[
        {
          question: "What is the maximum age for a mortgage in the UK?",
          answer:
            "There's no single rule — lenders set their own maximum ages, commonly between 70 and 85 at the end of the mortgage term.",
        },
        {
          question: "Which applicant's age is used for joint mortgages?",
          answer:
            "Typically the oldest applicant, since they reach the lender's maximum age limit first.",
        },
      ]}
    />
  );
}
