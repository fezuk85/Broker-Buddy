import Link from "next/link";

export function StampDutyGuide() {
  return (
    <>
      <h2>A plain-English guide to Stamp Duty Land Tax (SDLT)</h2>
      <p>
        Stamp Duty Land Tax is a tax you pay when you buy a residential property or land in England or Northern
        Ireland above certain price thresholds. It is charged in <strong>slices</strong>, like income tax: each
        portion of the price is taxed at the rate for its own band, not the whole price at one rate. Wales and
        Scotland have their own equivalents, covered further down and in the calculator above.
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

      <h3>Wales: Land Transaction Tax (LTT)</h3>
      <p>
        Wales charges Land Transaction Tax instead of SDLT, also in slices. There is no first-time buyer relief and
        no non-UK resident surcharge. The main residential rates are:
      </p>
      <table>
        <thead>
          <tr>
            <th>Part of the price</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Up to £225,000</td><td>0%</td></tr>
          <tr><td>£225,001 – £400,000</td><td>6%</td></tr>
          <tr><td>£400,001 – £750,000</td><td>7.5%</td></tr>
          <tr><td>£750,001 – £1,500,000</td><td>10%</td></tr>
          <tr><td>Above £1,500,000</td><td>12%</td></tr>
        </tbody>
      </table>
      <p>
        Buying an additional dwelling worth £40,000 or more uses the <strong>higher residential rates</strong> instead,
        again charged band by band: 5% up to £180,000, 8.5% to £250,000, 10% to £400,000, 12.5% to £750,000, 15% to
        £1,500,000 and 17% above that. On a £300,000 purchase that is £4,500 at the main rates and £19,950 at the
        higher rates.
      </p>

      <h3>Scotland: Land and Buildings Transaction Tax (LBTT)</h3>
      <p>
        Scotland charges LBTT, in slices. There is no non-UK resident surcharge. The residential rates are:
      </p>
      <table>
        <thead>
          <tr>
            <th>Part of the price</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Up to £145,000</td><td>0%</td></tr>
          <tr><td>£145,001 – £250,000</td><td>2%</td></tr>
          <tr><td>£250,001 – £325,000</td><td>5%</td></tr>
          <tr><td>£325,001 – £750,000</td><td>10%</td></tr>
          <tr><td>Above £750,000</td><td>12%</td></tr>
        </tbody>
      </table>
      <p>
        First-time buyers get a higher zero-rate band of £175,000, worth up to £600, at any price. Buying an
        additional dwelling of £40,000 or more adds the <strong>Additional Dwelling Supplement (ADS)</strong>, 8% of
        the whole price, on top of the LBTT: on a £300,000 purchase that is £4,600 plus £24,000, so £28,600.
      </p>

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
        This tool does not cover non-residential or mixed-use property, company purchases, leasehold rent
        calculations, multiple-dwelling relief, or purchases agreed before a rate change took effect. Rates can
        change at any Budget; these were checked against GOV.UK, GOV.WALES and Revenue Scotland in September 2026.
        Always confirm the figure with your conveyancer.
      </p>
    </>
  );
}
