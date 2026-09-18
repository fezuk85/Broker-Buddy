import Link from "next/link";

export function LtvGuide() {
  return (
    <>
      <h2>What is loan-to-value (LTV) and why does it matter?</h2>
      <p>
        Loan-to-value is the size of your mortgage as a percentage of your property&apos;s value. Lenders use it as
        a quick measure of risk: the lower the LTV, the bigger the cushion between what you owe and what the
        property is worth, and the less the lender stands to lose if things go wrong. It is also one of the main
        factors in how a mortgage is priced.
      </p>

      <h3>How is LTV calculated?</h3>
      <p>
        Divide the mortgage balance by the property value and multiply by 100. When you are buying, the value
        used is normally the lower of the purchase price and the lender&apos;s own valuation. When you are
        remortgaging, it is the lender&apos;s valuation (or your estimate, if they accept one). Your{" "}
        <strong>equity</strong> is simply the property value minus what you owe. If you plan to borrow more, the
        &quot;proposed&quot; LTV uses your existing balance plus the extra amount.
      </p>

      <div className="worked-example">
        <p><strong>Worked example: £300,000 home, £240,000 mortgage</strong></p>
        <ul>
          <li>Current LTV: £240,000 ÷ £300,000 = <strong>80%</strong>. Equity: <strong>£60,000</strong>.</li>
          <li>
            Borrow a further £15,000: total borrowing £255,000, so the proposed LTV is <strong>85%</strong> and
            equity falls to <strong>£45,000</strong>.
          </li>
          <li>
            At a 75% band the maximum loan would be £225,000, which is below the current balance, so nothing more
            is available at that band. At a 90% band the maximum is £270,000, leaving £30,000 of headroom.
          </li>
        </ul>
        <p>Assumes the property value stays at £300,000 and no fees are added to the loan.</p>
      </div>

      <h3>What is a good LTV?</h3>
      <p>
        There is no single answer, but lenders commonly price in bands, often at 60%, 75%, 80%, 85%, 90% and 95%.
        Crossing down into a lower band can open up cheaper products, so the lowest bands generally carry the
        lowest rates. The exact bands, and the rate difference between them, vary by lender and change over time.
        A higher LTV also means a smaller deposit or less equity, and a fall in house prices can leave you with
        little or no equity.
      </p>

      <h3>How can your LTV change?</h3>
      <ul>
        <li>Making repayments on a repayment mortgage reduces the balance, so LTV falls over time.</li>
        <li>Overpayments reduce the balance faster.</li>
        <li>If your property&apos;s value rises, LTV falls even if the balance is unchanged; if it falls, LTV rises.</li>
        <li>Borrowing more, or adding fees to the loan, increases LTV.</li>
        <li>Improvements can raise the value, though a valuer will only count what the market would pay for.</li>
      </ul>

      <h3>Common pitfalls</h3>
      <ul>
        <li>Using an optimistic value. Online estimates and asking prices are not the same as a lender&apos;s valuation.</li>
        <li>Forgetting fees that are added to the loan, which raise the balance used in the calculation.</li>
        <li>Assuming the band is a hard promise. LTV is only one part of a lender&apos;s decision alongside income, credit history and affordability.</li>
      </ul>

      <h3>Using the calculator</h3>
      <p>
        Enter the property value, your current balance and any extra you want to borrow. The table shows the
        maximum loan at each band and the additional amount that would leave. To see what the extra borrowing
        might cost each month, try the{" "}
        <Link href="/mortgage-repayment-calculator">mortgage repayment calculator</Link>, and to check the
        borrowing against income, use the <Link href="/loan-to-income-calculator">loan-to-income calculator</Link>.
        If you are considering borrowing against your home without changing your main mortgage, see the{" "}
        <Link href="/second-charge-calculator">second charge calculator</Link>. This is general information, not
        advice.
      </p>
    </>
  );
}
