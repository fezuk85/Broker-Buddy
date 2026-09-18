import Link from "next/link";

export function OverpaymentGuide() {
  return (
    <>
      <h2>Should you overpay your mortgage?</h2>
      <p>
        On a repayment mortgage, interest is charged on your outstanding balance. Every pound you overpay reduces
        that balance immediately, so you are charged less interest in every later month — and because the effect
        compounds over years, small overpayments early in the term can save a surprising amount. Most lenders let you
        either <strong>shorten the term</strong> (keeping the payment the same) or <strong>reduce the monthly
        payment</strong>; this calculator shows the shorter-term route.
      </p>

      <div className="worked-example">
        <p><strong>Worked example: £200,000 at 5% over 25 years</strong></p>
        <ul>
          <li>Standard payment: <strong>£1,169 a month</strong>, with about <strong>£150,750</strong> of interest over the full 25 years.</li>
          <li>
            Overpay <strong>£200 a month</strong>: the mortgage is cleared in about 18 years 10 months — roughly{" "}
            <strong>6 years 2 months sooner</strong> — and you save about <strong>£41,800</strong> of interest.
          </li>
          <li>
            Overpay a one-off <strong>£10,000 lump sum</strong> today: the mortgage ends about 2 years 4 months
            sooner and saves about <strong>£22,900</strong> of interest.
          </li>
        </ul>
      </div>

      <h3>Check your early repayment charge (ERC) allowance first</h3>
      <p>
        Many fixed-rate and discounted deals let you overpay up to a set limit each year — commonly{" "}
        <strong>10% of the balance</strong> — without a penalty. Go over that limit during the deal period and you
        can be charged an early repayment charge, often a percentage of the amount overpaid above the allowance.
        Tracker and standard variable rate deals often have no such charge. The calculator shows what share of your
        balance you would overpay in the first year so you can compare it against your lender&apos;s allowance.
      </p>

      <h3>When overpaying may not be the best use of cash</h3>
      <ul>
        <li>You do not yet have an emergency fund — money paid into a mortgage is hard to get back out.</li>
        <li>You have more expensive debt, such as credit cards or personal loans, which is usually better to clear first.</li>
        <li>Your mortgage rate is low and you could earn more in a savings account or pension (after tax and risk).</li>
        <li>Your lender would charge an ERC on the amount you plan to overpay.</li>
      </ul>

      <h3>How this calculator works</h3>
      <p>
        It works out the standard repayment for your balance, rate and remaining term, then simulates each month with
        your overpayment and any lump sum applied. It assumes the interest rate stays the same for the whole
        remaining term, so real results will differ if your rate changes — for example when a fixed deal ends. To see
        how a rate change would affect your payment, use the{" "}
        <Link href="/mortgage-repayment-calculator">mortgage repayment calculator</Link>. If you are thinking about
        releasing equity instead, try the <Link href="/ltv-calculator">LTV calculator</Link>.
      </p>
    </>
  );
}
