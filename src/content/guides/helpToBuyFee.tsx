import Link from "next/link";

export function HelpToBuyFeeGuide() {
  return (
    <>
      <h2>Help to Buy equity loan fees after year five</h2>
      <p>
        A Help to Buy equity loan (England, 2013 to 2021) is interest-free for the first five years. After that, the
        government&apos;s homebuyer&apos;s guide says you pay a fee of <strong>1.75% a year</strong> of the equity loan
        amount at the time you bought, and the fee rate then <strong>rises each year by the increase in RPI plus 1%</strong>.
        A £1 monthly management fee also applies from the start. Because the fee rate keeps climbing, many owners ask
        whether it is worth repaying the equity loan, in part or in full.
      </p>

      <div className="worked-example">
        <p>
          <strong>Worked example: a £40,000 equity loan, with RPI at 5%</strong>
        </p>
        <ul>
          <li>Year 6: 1.75% of £40,000 is £700 a year, about £58 a month plus the £1 management fee.</li>
          <li>Year 7: the fee rate rises by 6% (RPI plus 1%) to about 1.86%.</li>
          <li>Year 10: about 2.21%, roughly £884 a year.</li>
        </ul>
      </div>

      <h3>Repaying the equity loan</h3>
      <ul>
        <li>
          You can repay part (<strong>staircasing</strong>) at any time. Each part repayment must be at least{" "}
          <strong>10% of your home&apos;s current market value</strong>.
        </li>
        <li>
          What you pay is your loan percentage of the home&apos;s <strong>current value</strong>, so it rises if your
          home has gone up in value.
        </li>
        <li>An independent valuer must value the home and you pay for the valuation. Outstanding fees are paid at the same time.</li>
      </ul>

      <h3>Ways people fund a repayment</h3>
      <p>
        Savings, a remortgage to a larger mortgage, a further advance, or a second charge loan. Increasing your first
        mortgage to repay the equity loan needs the approval of Homes England&apos;s Mortgage Administrator, as does other
        additional borrowing. Read how a{" "}
        <Link href="/help-to-buy-second-charge">second charge works on a Help to Buy home</Link> and compare it with
        remortgaging using the{" "}
        <Link href="/second-charge-vs-early-repayment-charge">second charge vs early repayment charge calculator</Link>.
      </p>

      <h3>How this calculator works</h3>
      <p>
        It applies the published rules: a 1.75% fee rate from year six, increased each year by RPI plus 1%, on the equity
        loan amount at purchase, plus the £1 monthly management fee. The cost to repay is your loan percentage multiplied
        by the value you enter. RPI is an assumption, so change it to see how sensitive the fee is. Rules can change, so
        check the current position with Homes England.
      </p>
    </>
  );
}
