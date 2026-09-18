import Link from "next/link";

export function BridgingGuide() {
  return (
    <>
      <h2>A plain-English guide to bridging loan interest</h2>
      <p>
        A bridging loan is short-term finance secured against property, typically lasting from around 3 to 24
        months. It is often used to complete a purchase quickly, or to cover the gap until a sale, a refinance or
        another source of funds arrives. Because the term is short, bridging is normally priced as a monthly rate
        rather than an annual one, and the lender will want a clear plan for how it will be repaid.
      </p>

      <h3>How is bridging loan interest charged?</h3>
      <p>Lenders commonly offer three arrangements, and which are available varies by lender and product:</p>
      <ul>
        <li><strong>Serviced:</strong> you pay the interest each month, and the loan balance stays the same.</li>
        <li><strong>Retained:</strong> the interest for the whole term is deducted from the loan up front, so you receive less than the gross loan.</li>
        <li><strong>Rolled up:</strong> no monthly payments; interest is added to the balance and repaid with the loan at the end.</li>
      </ul>
      <p>
        This calculator covers retained and serviced interest. With retained interest the gross loan has to be larger
        than the amount you need, and interest is charged on that larger figure, so the cost is higher than the same
        rate on the net amount alone.
      </p>

      <div className="worked-example">
        <p><strong>Worked example: £200,000 net loan, 0.75% a month, 9 months</strong></p>
        <p>
          Assumptions: 2% arrangement fee, plus £1,000 broker fee, £350 valuation fee and £500 other fees (£1,850 in
          flat fees).
        </p>
        <ul>
          <li>
            <strong>Serviced:</strong> interest is £200,000 × 0.75% × 9 = £13,500. Fees are £4,000 + £1,850 = £5,850.
            Total cost is <strong>£19,350</strong>, with £200,000 repaid at the end.
          </li>
          <li>
            <strong>Retained:</strong> the gross loan is £221,205 (the £200,000 you need, plus the flat fees, divided
            by 1 − 6.75% interest − 2% fee). Interest is £14,931 and fees are £6,274, so total cost is{" "}
            <strong>£21,205</strong>, with £221,205 repaid at the end.
          </li>
        </ul>
        <p>
          The retained loan costs about £1,855 more here because interest and the arrangement fee are charged on a
          larger loan. In exchange there are no monthly payments to make.
        </p>
      </div>

      <h3>What costs are there besides interest?</h3>
      <p>
        Common items include an arrangement fee (usually a percentage of the loan), valuation and legal fees, broker
        fees and sometimes an exit fee. Not every lender charges each one, so use the &quot;other fees&quot; field
        for anything specific to your quote.
      </p>

      <h3>Why does the exit strategy matter?</h3>
      <p>
        Lenders assess how the loan will be repaid, such as a sale, a refinance onto a longer-term mortgage or the
        release of other funds. If the exit is delayed, further interest accrues and extension fees or higher default
        rates may apply, depending on the lender&apos;s terms.
      </p>

      <h3>Common pitfalls</h3>
      <ul>
        <li>Comparing a monthly rate with an annual one without converting.</li>
        <li>Forgetting that retained interest increases the gross loan.</li>
        <li>Leaving out exit, valuation or legal costs when totting up the price.</li>
        <li>Underestimating how long a sale or refinance can take.</li>
      </ul>

      <p>
        <strong>Risk note:</strong> bridging loans are secured on property. Your home or investment property may be
        repossessed if you do not keep up repayments.
      </p>

      <h3>What next?</h3>
      <p>
        See how much of the property&apos;s value the loan represents with the{" "}
        <Link href="/ltv-calculator">LTV calculator</Link>, model a loan behind an existing mortgage in the{" "}
        <Link href="/second-charge-calculator">second charge calculator</Link>, or work out purchase costs with the{" "}
        <Link href="/stamp-duty-calculator">stamp duty calculator</Link>. This is general information, not advice, and
        the lender&apos;s own illustration is the definitive figure.
      </p>
    </>
  );
}
