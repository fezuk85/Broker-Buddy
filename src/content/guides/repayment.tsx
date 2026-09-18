import Link from "next/link";

export function RepaymentGuide() {
  return (
    <>
      <h2>How is a mortgage repayment worked out?</h2>
      <p>
        On a <strong>repayment</strong> (capital and interest) mortgage, each monthly payment covers the interest
        for that month and pays off some of the loan. Early on most of the payment is interest; later, more goes
        towards the balance. If every payment is made, the balance reaches zero at the end of the term. On an{" "}
        <strong>interest-only</strong> mortgage you pay just the interest, so the amount borrowed is unchanged and
        has to be repaid some other way when the term ends.
      </p>
      <p>
        The repayment figure depends on three things: the amount borrowed, the interest rate and the term. This
        calculator uses the standard amortisation formula with a fixed annual rate converted to a monthly rate.
      </p>

      <div className="worked-example">
        <p><strong>Worked example: £200,000 at 5% over 25 years</strong></p>
        <ul>
          <li>Repayment: <strong>£1,169 a month</strong>, total repaid about <strong>£350,754</strong>, of which about <strong>£150,754</strong> is interest.</li>
          <li>Interest-only on the same loan: <strong>£833 a month</strong>, and the full £200,000 is still owed at the end.</li>
          <li>Over 20 years the repayment rises to about <strong>£1,320</strong> a month but total interest falls to about <strong>£116,779</strong>. Over 30 years it drops to about <strong>£1,074</strong> a month.</li>
        </ul>
        <p>Assumes the rate stays fixed for the whole term and there are no fees or overpayments.</p>
      </div>

      <h3>What happens if interest rates go up?</h3>
      <p>
        Many people are on a fixed rate for a few years and then move to a new rate. The calculator&apos;s rate
        comparison shows your payment at the current rate and at 0.5, 1 and 2 percentage points higher. For the
        example above:
      </p>
      <table>
        <thead>
          <tr>
            <th>Rate</th>
            <th>Monthly payment</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>5.0%</td><td>£1,169</td><td>-</td></tr>
          <tr><td>5.5%</td><td>£1,228</td><td>+£59</td></tr>
          <tr><td>6.0%</td><td>£1,289</td><td>+£119</td></tr>
          <tr><td>7.0%</td><td>£1,414</td><td>+£244</td></tr>
        </tbody>
      </table>

      <h3>How does the term affect the cost?</h3>
      <p>
        A longer term lowers the monthly payment but means interest is charged on a larger balance for longer, so
        the total interest is higher. A shorter term does the opposite. Lenders also apply an upper limit on the
        term, often linked to the borrower&apos;s age at the end.
      </p>

      <h3>Is interest-only cheaper?</h3>
      <p>
        The monthly payment is lower because none of it reduces the loan, but you still owe the whole amount at
        the end, and lenders usually want to see a credible plan for repaying it. Some borrowers use a part
        repayment, part interest-only split, which this calculator does not model.
      </p>

      <h3>Things this figure does not include</h3>
      <ul>
        <li>Arrangement or product fees, unless you add them to the loan amount.</li>
        <li>Buildings insurance, life cover, service charges or ground rent.</li>
        <li>Changes in rate after an introductory or fixed period ends.</li>
      </ul>

      <p>
        To see how paying extra each month changes things, use the{" "}
        <Link href="/mortgage-overpayment-calculator">overpayment calculator</Link>. To check how much a lender
        might consider lending against your income, try the{" "}
        <Link href="/mortgage-affordability-calculator">mortgage affordability calculator</Link>. This is general
        information, not advice.
      </p>
    </>
  );
}
