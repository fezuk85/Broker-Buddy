import Link from "next/link";

export function AgeTermGuide() {
  return (
    <>
      <h2>How old can you be to get a mortgage?</h2>
      <p>
        In the UK there is no single legal maximum age for a mortgage. Instead, each lender sets its own policy on
        the oldest age a borrower may be when the mortgage ends. Those limits vary, but they commonly fall
        somewhere between 70 and 85. Some lenders also set a minimum age, usually 18, and a few have separate
        products for older borrowers, such as retirement interest-only mortgages. Because policies differ and
        change, always check the current criteria of the lender you are considering.
      </p>

      <h3>How is the maximum mortgage term worked out?</h3>
      <p>
        Take the lender&apos;s maximum age and subtract your age. The result is the longest term you could be
        offered on age grounds alone. The calculator does this to the month using your date of birth, and shows the
        result for lender limits of 70, 75, 80 and 85. If you ask for a longer term than the limit allows, the
        lender may shorten it, which raises the monthly payment, or decline.
      </p>

      <div className="worked-example">
        <p><strong>Worked example: an applicant aged exactly 45</strong></p>
        <ul>
          <li>Lender limit 70: 70 - 45 = <strong>25 years</strong>.</li>
          <li>Lender limit 75: 75 - 45 = <strong>30 years</strong>.</li>
          <li>Lender limit 80: 80 - 45 = <strong>35 years</strong>.</li>
          <li>Lender limit 85: 85 - 45 = <strong>40 years</strong>.</li>
        </ul>
        <p>
          If this applicant asked for a 30-year term, they would be 75 at the end, which fits a limit of 75 or
          above but not 70. Real applicants are rarely exactly on a birthday, so the calculator counts extra months.
        </p>
      </div>

      <h3>Which age is used for joint applications?</h3>
      <p>
        Usually the oldest applicant, because they reach the lender&apos;s limit first. Some lenders look at
        both applicants or at when the older borrower is expected to retire, so the outcome can vary. When you use
        the calculator for a joint application, enter the oldest applicant&apos;s date of birth.
      </p>

      <h3>Why does age matter to lenders?</h3>
      <p>
        Lenders need to be confident the mortgage can be repaid from income throughout the term. As borrowers near
        retirement, many lenders ask how the payments will be met once employment income falls, and may look at
        pension income instead. This is part of the affordability assessment, not just a fixed age cut-off.
      </p>

      <h3>Shorter terms and monthly cost</h3>
      <p>
        A shorter maximum term means each payment has to clear the loan faster, so payments are higher for the
        same loan. On £200,000 at an illustrative 5%, a 25-year term costs about £1,169 a month and a 20-year term
        about £1,320. Use the{" "}
        <Link href="/mortgage-repayment-calculator">mortgage repayment calculator</Link> to compare terms for your
        own figures.
      </p>

      <h3>Points to remember</h3>
      <ul>
        <li>Age limits refer to age at the end of the term, not when you apply.</li>
        <li>Lenders that accept older ages may still require evidence of retirement income.</li>
        <li>Age can affect how much can be borrowed, which you can explore in the <Link href="/mortgage-affordability-calculator">mortgage affordability calculator</Link>.</li>
      </ul>
      <p>This is general information, not advice.</p>
    </>
  );
}
