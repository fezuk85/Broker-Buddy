import Link from "next/link";

export function StampDutyGuide() {
  return (
    <>
      <h2>A plain-English guide to Stamp Duty Land Tax (SDLT)</h2>
      <p>
        Stamp Duty Land Tax is a tax you pay when you buy a residential property or land in England or Northern
        Ireland above certain price thresholds. It is charged in <strong>slices</strong>, like income tax: each
        portion of the price is taxed at the rate for its own band, not the whole price at one rate.
      </p>

      <h3>Standard residential rates (England &amp; Northern Ireland)</h3>
      <table>
        <thead>
          <tr>
            <th>Part of the price</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Up to £125,000</td><td>0%</td></tr>
          <tr><td>£125,001 to £250,000</td><td>2%</td></tr>
          <tr><td>£250,001 to £925,000</td><td>5%</td></tr>
          <tr><td>£925,001 to £1.5 million</td><td>10%</td></tr>
          <tr><td>Above £1.5 million</td><td>12%</td></tr>
        </tbody>
      </table>

      <h3>First-time buyer relief</h3>
      <p>
        If <strong>every buyer</strong> has never owned a residential property anywhere in the world, you pay no
        SDLT on the first £300,000 and 5% on the portion from £300,001 to £500,000. There is a cliff edge: if the
        price is above £500,000 you get <strong>no</strong> first-time buyer relief at all and standard rates apply
        to the whole price.
      </p>

      <h3>Buying an additional property</h3>
      <p>
        If you already own another residential property and are not replacing your main home, a{" "}
        <strong>5% surcharge</strong> is added on top of every band — in practice 5% of the whole price (the
        surcharge does not apply to purchases under £40,000). Buy-to-let landlords and second-home buyers pay this.
        If you are replacing your main residence but haven&apos;t sold the old one yet, you may be able to reclaim
        the surcharge if you sell the previous home within three years.
      </p>

      <h3>Non-UK residents</h3>
      <p>
        A further <strong>2% surcharge</strong> applies to the whole price if you are not UK resident for tax
        purposes (broadly, in the UK for fewer than 183 days in the 12 months before purchase). It stacks with the
        additional-property surcharge.
      </p>

      <div className="worked-example">
        <p><strong>Worked example: a £350,000 purchase</strong></p>
        <ul>
          <li>
            <strong>Home mover (standard rates):</strong> £0 on the first £125,000 + 2% of £125,000 (£2,500) + 5% of
            £100,000 (£5,000) = <strong>£7,500</strong>.
          </li>
          <li>
            <strong>First-time buyer:</strong> £0 on the first £300,000 + 5% of £50,000 = <strong>£2,500</strong>.
          </li>
          <li>
            <strong>Additional property (e.g. buy-to-let):</strong> £7,500 standard SDLT + 5% surcharge on £350,000
            (£17,500) = <strong>£25,000</strong>.
          </li>
        </ul>
      </div>

      <h3>When is SDLT paid?</h3>
      <p>
        The SDLT return and payment are normally due within <strong>14 days of completion</strong>. In most
        purchases your solicitor or conveyancer files the return and pays it from the funds you send them, so it is
        worth budgeting for it alongside your deposit, legal fees and any lender or valuation fees. You can compare
        the total cost of a purchase against your borrowing using the{" "}
        <Link href="/ltv-calculator">LTV calculator</Link> and the{" "}
        <Link href="/mortgage-repayment-calculator">mortgage repayment calculator</Link>.
      </p>

      <h3>What this calculator does not cover</h3>
      <p>
        Wales charges Land Transaction Tax and Scotland charges Land and Buildings Transaction Tax — both have
        different rates and reliefs. This tool also does not cover non-residential or mixed-use property, company
        purchases, leasehold rent calculations or multiple-dwelling relief. Rates can change at any Budget; these
        were checked against GOV.UK in September 2026. Always confirm the figure with your conveyancer.
      </p>
    </>
  );
}
