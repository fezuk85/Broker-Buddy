import Link from "next/link";

export function SecondChargeGuide() {
  return (
    <>
      <h2>A plain-English guide to second and third charge loans</h2>
      <p>
        A second charge loan is a loan secured on a property that already has a mortgage. The existing mortgage stays
        in place, and the new lender takes a legal charge that ranks behind it. A third charge ranks behind both. They
        are also known as secured loans or homeowner loans.
      </p>

      <h3>How does a second charge work?</h3>
      <p>
        If the property is sold or repossessed, the proceeds go to the first charge holder first. Only what is left
        goes to the second charge holder, and then to any third charge holder. Because a later charge is more exposed
        if values fall, second and third charge lenders assess risk carefully and typically price and cap lending
        accordingly. The first-charge lender&apos;s consent is usually needed before a further charge is registered, and
        lenders apply their own criteria.
      </p>

      <h3>What is combined LTV?</h3>
      <p>
        Lenders look at the <strong>combined</strong> loan-to-value: all balances secured on the property, including the
        proposed new loan, divided by the property value. The calculator shows this building up charge by charge.
        Maximum combined LTV varies by lender and product.
      </p>

      <div className="worked-example">
        <p><strong>Worked example: £400,000 property, £180,000 first charge, £40,000 new loan</strong></p>
        <ul>
          <li>Current combined LTV: £180,000 ÷ £400,000 = <strong>45%</strong>.</li>
          <li>Proposed combined LTV: £220,000 ÷ £400,000 = <strong>55%</strong>. Equity falls from £220,000 to £180,000.</li>
          <li>
            Interest-only at 9.5% a year: £40,000 × 9.5% ÷ 12 = <strong>£316.67</strong> a month (the rate is an
            assumption for illustration).
          </li>
        </ul>
        <p>
          If the property is let, rent must cover both payments. With a £900 first charge payment, the combined
          payment is £1,216.67. At 125% ICR the rent required is <strong>£1,520.83</strong>. Rent of £1,600 gives 131.5%
          coverage and passes, with £79.17 a month to spare. Higher required percentages, such as 145%, would need more
          rent.
        </p>
      </div>

      <h3>Second charge or remortgage?</h3>
      <p>
        A remortgage replaces the existing loan, which can trigger early repayment charges and a new rate on the whole
        balance. A second charge leaves the existing mortgage untouched but usually carries a different rate and
        different fees on the new amount. Which is cheaper depends on the figures involved, so compare total costs on
        both routes.
      </p>

      <h3>Common pitfalls</h3>
      <ul>
        <li>Looking at the new loan&apos;s LTV alone rather than the combined figure.</li>
        <li>Forgetting fees such as lender, broker and valuation fees.</li>
        <li>For buy-to-let, testing rent against the new payment only rather than both payments together.</li>
        <li>Overlooking that repayment terms can be long, so total interest can be significant.</li>
      </ul>

      <p>
        <strong>Risk note:</strong> a second or third charge is secured on your property. Your home may be repossessed
        if you do not keep up repayments on any loan secured on it.
      </p>

      <h3>What next?</h3>
      <p>
        Check the single-mortgage picture with the <Link href="/ltv-calculator">LTV calculator</Link>, test rental
        coverage using the <Link href="/btl-icr-calculator">buy-to-let ICR calculator</Link>, or compare monthly costs
        with the <Link href="/mortgage-repayment-calculator">mortgage repayment calculator</Link>. This is general
        information, not advice.
      </p>
    </>
  );
}
