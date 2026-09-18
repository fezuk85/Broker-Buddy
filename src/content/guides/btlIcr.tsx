import Link from "next/link";

export function BtlIcrGuide() {
  return (
    <>
      <h2>A plain-English guide to buy-to-let ICR and DSCR</h2>
      <p>
        Buy-to-let lenders lend against the rent a property can produce, not just the landlord&apos;s salary. The
        test they use is usually called the <strong>interest coverage ratio (ICR)</strong>. A closely related
        measure, the <strong>debt service coverage ratio (DSCR)</strong>, compares rent with the actual monthly
        mortgage payment instead of a notional one.
      </p>

      <h3>How does ICR work for buy-to-let?</h3>
      <p>
        The lender takes the loan, applies a notional &quot;stress&quot; interest rate, and works out the monthly
        interest-only cost. The rent must then be at least a set percentage of that figure. The formula is:
      </p>
      <p>
        <strong>required monthly rent = loan × stress rate ÷ 12 × required ICR</strong>
      </p>
      <p>
        The stress rate is typically higher than the rate you will actually pay, so the test checks that the
        property would still cover its costs if borrowing costs rose. Which stress rate a lender uses, and whether it
        applies one at all to a longer fixed rate, varies by lender and product.
      </p>

      <h3>What ICR percentage do lenders ask for?</h3>
      <table>
        <thead>
          <tr>
            <th>Borrower</th>
            <th>Commonly required ICR</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Basic-rate taxpayer</td><td>125%</td></tr>
          <tr><td>Higher / additional-rate taxpayer</td><td>145%</td></tr>
          <tr><td>Limited company</td><td>125%</td></tr>
        </tbody>
      </table>
      <p>
        These are the figures this calculator defaults to. They are common in the market, but each lender sets its
        own, and some use different levels or treat company borrowers differently. Higher requirements for individual
        higher-rate taxpayers reflect Section 24, which replaced mortgage interest deductions with a basic-rate tax
        credit.
      </p>

      <h3>What is the difference between ICR and DSCR?</h3>
      <p>
        ICR (the &quot;Estimate from rate&quot; mode here) works from a loan amount and a stress rate. DSCR (the
        &quot;Actual payment&quot; mode) divides rent by a real monthly payment and compares the result with the
        required percentage. Lenders differ on which they use, and some use both. DSCR is simply rent ÷ payment × 100.
      </p>

      <div className="worked-example">
        <p><strong>Worked example: £200,000 loan, £1,300 monthly rent, 5.5% stress rate</strong></p>
        <ul>
          <li>Monthly interest at the stress rate: £200,000 × 5.5% ÷ 12 = <strong>£916.67</strong>.</li>
          <li>At 125% ICR the rent required is £916.67 × 1.25 = <strong>£1,145.83</strong>. Rent of £1,300 passes.</li>
          <li>At 145% ICR the rent required is £916.67 × 1.45 = <strong>£1,329.17</strong>. Rent of £1,300 falls £29.17 short.</li>
          <li>
            Working backwards, £1,300 of rent supports a maximum loan of about <strong>£226,909</strong> at 125% or
            about <strong>£195,611</strong> at 145%.
          </li>
        </ul>
        <p>
          The same property and the same rent can therefore pass for one borrower and fail for another, purely
          because of the required percentage.
        </p>
      </div>

      <h3>Common pitfalls</h3>
      <ul>
        <li>Using the rate you expect to pay rather than the lender&apos;s stress rate in an ICR estimate.</li>
        <li>Assuming the same ICR applies to every lender, borrower type and product.</li>
        <li>Using optimistic rent. Lenders often use their own surveyor&apos;s rental valuation, which may be lower than what you hope to achieve.</li>
        <li>Forgetting that a second charge on the property adds to the payments the rent must cover.</li>
      </ul>

      <h3>What next?</h3>
      <p>
        You can compare rent against the property price using the{" "}
        <Link href="/rental-yield-calculator">rental yield calculator</Link>, check how much of the value is
        borrowed with the <Link href="/ltv-calculator">LTV calculator</Link>, or see how a further loan affects
        coverage in the <Link href="/second-charge-calculator">second charge calculator</Link>. This is general
        information, not advice, and a lender&apos;s own criteria always take priority.
      </p>
    </>
  );
}
