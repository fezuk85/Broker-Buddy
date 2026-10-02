"use client";

import { Field, NumberInput } from "@/components/Field";

/**
 * One fee: the amount, plus whether it is paid upfront or added to the loan. Every fee in the
 * calculators uses this so the choice is always available and always worded the same way.
 */
export function FeeField({
  label,
  hint,
  amount,
  onAmountChange,
  addedToLoan,
  onAddedToLoanChange,
  suffix,
  step,
}: {
  label: string;
  hint?: string;
  amount: number;
  onAmountChange: (value: number) => void;
  addedToLoan: boolean;
  onAddedToLoanChange: (added: boolean) => void;
  /** Use "%" for a percentage fee; otherwise the amount is shown in pounds. */
  suffix?: string;
  step?: number;
}) {
  return (
    <div>
      <Field label={label}>
        <NumberInput prefix={suffix ? undefined : "£"} suffix={suffix} value={amount} onChange={onAmountChange} step={step} />
      </Field>
      <select
        aria-label={`${label}: how it is paid`}
        value={addedToLoan ? "added" : "upfront"}
        onChange={(e) => onAddedToLoanChange(e.target.value === "added")}
        className="mt-1 w-full rounded-lg border border-[var(--bb-border)] bg-white px-2 py-1.5 text-xs bb-tap-target focus:outline-none focus:ring-2 focus:ring-[var(--bb-primary)]/40 focus:border-[var(--bb-primary)]"
      >
        <option value="upfront">Paid upfront</option>
        <option value="added">Added to the loan</option>
      </select>
      {hint && <span className="mt-1 block text-xs text-[var(--bb-muted)]">{hint}</span>}
    </div>
  );
}
