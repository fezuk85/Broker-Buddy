import Link from "next/link";

export function LoanToIncomeGuide() {
  return (
    <>
      <h2>What is loan-to-income (LTI)?</h2>
      <p>
        Loan-to-income, also called an income multiple, compares the amount you want to borrow with your gross
        (before tax) annual income. It is the simplest way to see how large a mortgage is relative to what you
        earn, and it is a common first check when people ask how much they can borrow.
      </p>

      <h3>How is loan-to-income calculated?</h3>
      <p>
        Divide the loan by total gross annual income. For joint applications, add the incomes together. The
        calculator also shows the maximum borrowing at multiples of 4, 4.5, 5, 5.5 and 6 times income so you can
        see the range at a glance.
      </p>

      <div className="worked-example">
        <p><strong>Worked example: £200,000 loan, joint income of £60,000</strong></p>
        <ul>
          <li>LTI: £200,000 ÷ £60,000 = <strong>3.33 times</strong> income.</li>
          <li>At 4 times income, borrowing would be £240,000.</li>
          <li>At 4.5 times: <strong>£270,000</strong>. At 5 times: <strong>£300,000</strong>.</li>
        </ul>
        <p>Assumes income is a combined gross figure from all applicants and ignores bonuses or benefits.</p>
      </div>

      <h3>What income multiple can you borrow?</h3>
      <p>
        Lenders commonly work at around 4 to 4.5 times income, and some go higher for certain applicants. There is
        a regulatory limit on the share of new mortgages a lender may advance at 4.5 times income or more, which
        is why multiples above that are less common and often restricted to particular circumstances or
        professions. Policies differ between lenders, so treat any single multiple as a rough guide.
      </p>

      <h3>Why LTI is not the whole story</h3>
      <p>
        Lenders do not simply apply a multiple. They carry out an affordability assessment that looks at your
        regular outgoings, credit commitments such as loans, cards and car finance, dependants, and whether you
        could still afford the payments if interest rates were higher. Two people with the same income can be
        offered quite different amounts.
      </p>
      <ul>
        <li>Debts and regular commitments reduce what a lender will lend.</li>
        <li>Different lenders count bonuses, overtime, commission and self-employed income in different ways.</li>
        <li>A larger deposit lowers the loan needed, which lowers LTI for the same property.</li>
      </ul>

      <h3>Which income counts?</h3>
      <p>
        Use gross annual income for everyone named on the mortgage. Basic salary is generally accepted in full.
        Variable income is often only partly counted, and lenders usually ask for payslips, tax returns or
        accounts to verify it.
      </p>

      <h3>Where to go next</h3>
      <p>
        For a fuller estimate that includes outgoings, use the{" "}
        <Link href="/mortgage-affordability-calculator">mortgage affordability calculator</Link>. To see how a
        given loan translates into monthly payments, try the{" "}
        <Link href="/mortgage-repayment-calculator">mortgage repayment calculator</Link>, and to see the loan
        against the property&apos;s value, use the <Link href="/ltv-calculator">LTV calculator</Link>. This is
        general information, not advice.
      </p>
    </>
  );
}
