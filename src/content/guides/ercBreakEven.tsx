import Link from "next/link";

export function ErcBreakEvenGuide() {
  return (
    <>
      <h2>Second charge or early repayment charge: which costs less?</h2>
      <p>
        If you are in the middle of a fixed or discounted mortgage deal and need to borrow more, there are usually three
        routes: ask your current lender for a <strong>further advance</strong>, <strong>remortgage</strong> to a new
        deal that includes the extra, or take a <strong>second charge loan</strong> from another lender that sits
        behind your existing mortgage. The catch with remortgaging mid-deal is the{" "}
        <strong>early repayment charge (ERC)</strong>, which is often a percentage of the balance and can run into
        thousands of pounds. A second charge leaves your existing mortgage, and its ERC, alone.
      </p>

      <div className="worked-example">
        <p>
          <strong>Illustration (figures are examples, not quotes)</strong>
        </p>
        <ul>
          <li>Mortgage balance of £180,000 at 2.5% with 20 years left, and a 3% ERC (about £5,400) if repaid early.</li>
          <li>You want £30,000. A new mortgage today would be at 5%; a second charge might be at 9% over 10 years.</li>
          <li>
            Remortgaging means paying the ERC and moving the whole £180,000 from 2.5% to 5%. The second charge only
            charges the higher rate on the £30,000 and keeps your cheap rate on the rest.
          </li>
          <li>The calculator above works out the total cost of both over the period you choose, including fees.</li>
        </ul>
      </div>

      <h3>When a second charge can make sense</h3>
      <ul>
        <li>Your current rate is well below today&apos;s rates, so you would rather not replace the whole mortgage.</li>
        <li>You are inside an early repayment charge period and the charge is large.</li>
        <li>Your current lender will not agree a further advance.</li>
        <li>You do not want to reset the term or terms of your main mortgage.</li>
      </ul>

      <h3>When it may not</h3>
      <ul>
        <li>The ERC is small or about to end — waiting, or a product transfer, can be cheaper.</li>
        <li>Your current mortgage rate is no lower than the market, so replacing it loses little.</li>
        <li>The second charge rate and fees are much higher than you assumed.</li>
        <li>
          A second charge is a second loan secured on your home. Missing payments puts your home at risk, and you will
          be paying two lenders.
        </li>
      </ul>

      <h3>Checks before you decide</h3>
      <p>
        Find the real early repayment charge in your mortgage offer or ask your lender for a redemption statement.
        Ask whether a further advance is available. Check whether the first-charge lender must consent to a second
        charge, and which second charge lenders will lend behind your mortgage. A broker who works with second charge
        lenders can tell you what is realistically on offer. You can also use our{" "}
        <Link href="/second-charge-calculator">second charge calculator</Link> to look at the loan itself.
      </p>
    </>
  );
}
