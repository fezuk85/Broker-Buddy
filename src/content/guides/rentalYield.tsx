import Link from "next/link";

export function RentalYieldGuide() {
  return (
    <>
      <h2>A plain-English guide to rental yield</h2>
      <p>
        Rental yield expresses a property&apos;s annual rent as a percentage of its value. It is a quick way to
        compare properties or areas on a like-for-like basis, whatever their price.
      </p>

      <h3>How do you calculate rental yield?</h3>
      <p>
        <strong>Gross yield = (monthly rent × 12) ÷ property value × 100.</strong> This is what the calculator above
        shows. It uses the property&apos;s value (or purchase price) and ignores every cost of owning and letting.
      </p>

      <h3>What is the difference between gross and net yield?</h3>
      <p>
        Net yield deducts the costs of running the property from the rent before dividing by the value. Typical costs
        include letting or management fees, maintenance and repairs, landlord insurance, ground rent and service
        charges, licensing or safety certificates, and periods when the property is empty. Mortgage interest and
        tax are sometimes shown separately, so it is worth checking what a quoted &quot;net&quot; figure includes.
      </p>

      <div className="worked-example">
        <p><strong>Worked example: £250,000 property let at £1,200 a month</strong></p>
        <ul>
          <li>Annual rent: £1,200 × 12 = <strong>£14,400</strong>.</li>
          <li>Gross yield: £14,400 ÷ £250,000 = <strong>5.76%</strong>.</li>
        </ul>
        <p>
          Now assume, purely for illustration, these annual costs: four weeks empty (£1,200), management at 10% of
          rent (£1,440), maintenance (£600) and insurance (£350). That is £3,590 in total, leaving £10,810.
        </p>
        <ul>
          <li>Net yield: £10,810 ÷ £250,000 = <strong>4.32%</strong>.</li>
        </ul>
      </div>

      <h3>What is a good rental yield?</h3>
      <p>
        There is no single answer. Yields tend to be higher where prices are low relative to rents and lower where
        prices are high, and higher yields can reflect higher risk, such as weaker demand or heavier maintenance.
        Comparing with similar properties in the same area is often more useful than a national target. Yield also
        says nothing about capital growth, which is a separate part of a property&apos;s return.
      </p>

      <h3>Common pitfalls</h3>
      <ul>
        <li>Quoting gross yield as though it were what you keep.</li>
        <li>Using the asking rent rather than a realistic achievable rent.</li>
        <li>Ignoring void periods, tenant changeover costs and major repairs.</li>
        <li>Comparing a gross figure from one listing with a net figure from another.</li>
        <li>Basing the calculation on a value that does not match what you actually pay, including purchase costs.</li>
      </ul>

      <h3>What next?</h3>
      <p>
        If you plan to borrow, lenders will test the rent against the loan rather than the yield, using the{" "}
        <Link href="/btl-icr-calculator">buy-to-let ICR calculator</Link>. Purchase costs such as the additional
        property surcharge are covered by the <Link href="/stamp-duty-calculator">stamp duty calculator</Link>, and
        the <Link href="/ltv-calculator">LTV calculator</Link> shows how much of the price is borrowed. This is
        general information, not financial or tax advice.
      </p>
    </>
  );
}
