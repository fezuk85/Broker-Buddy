import Link from "next/link";

export function DividendGuide() {
  return (
    <>
      <h2>Why do company directors take a salary and dividends?</h2>
      <p>
        Directors of their own limited company are paid in two main ways. A <strong>salary</strong> is taxed as
        employment income and can carry National Insurance (NI). <strong>Dividends</strong> are a share of the
        company&apos;s after-tax profit paid to shareholders, and they pay <strong>no NI</strong>. Because the two
        are taxed differently, many directors use a mix. The best mix depends on your circumstances and the
        company&apos;s, so speak to an accountant. The figures below are for the 2026/27 tax year in England, Wales
        and Northern Ireland and can change at any Budget.
      </p>

      <h3>How are dividends taxed in 2026/27?</h3>
      <p>
        Dividends are taxed as the top slice of your income: your salary uses up the personal allowance and the lower
        bands first. The first <strong>£500</strong> of dividends is covered by the dividend allowance, then:
      </p>
      <table>
        <thead>
          <tr>
            <th>Band the dividend falls in</th>
            <th>Dividend tax rate</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Basic rate (income up to £50,270)</td><td>10.75%</td></tr>
          <tr><td>Higher rate (£50,271 to £125,140)</td><td>35.75%</td></tr>
          <tr><td>Additional rate (above £125,140)</td><td>39.35%</td></tr>
        </tbody>
      </table>
      <p>
        The basic and higher dividend rates rose by 2 percentage points on 6 April 2026. The personal allowance
        (£12,570) is reduced by £1 for every £2 of total income above £100,000.
      </p>

      <div className="worked-example">
        <p><strong>Worked example: £12,570 salary and £30,000 of dividends</strong></p>
        <ul>
          <li>
            Salary: £12,570 is fully covered by the personal allowance, so income tax and employee NI are both{" "}
            <strong>£0</strong>.
          </li>
          <li>The first £500 of dividends uses the dividend allowance, leaving £29,500 taxable.</li>
          <li>All £29,500 falls in the basic rate band: 10.75% = <strong>£3,171.25</strong> of dividend tax.</li>
          <li>
            Take-home: £42,570 minus £3,171.25 = <strong>£39,398.75 a year</strong>, or about{" "}
            <strong>£3,283 a month</strong>.
          </li>
        </ul>
        <p>Assumes no other income, pension or student loan, and ignores Corporation Tax (see below).</p>
      </div>

      <h3>What does this calculator not include?</h3>
      <p>
        It covers only the tax you pay personally. <strong>Corporation Tax</strong> is paid by the company on its
        profits before dividends can be declared, and any employer NI is a company cost. Dividends can only be paid
        from available profits. The calculator also ignores pensions, student loans, Scottish rates and other
        income.
      </p>

      <h3>How do mortgage lenders treat director income?</h3>
      <p>
        Lenders vary. Many will look at a mix of salary and dividends, and for company directors it is common to
        look at your share of the company&apos;s net profit or an average over the last two or three years of
        accounts, often supported by SA302 tax calculations or an accountant&apos;s reference. Some lenders use only
        the most recent year and others an average, and they differ on how retained profit is treated. A broker who
        knows which lenders suit director applicants can help. To see what your income might support, use the{" "}
        <Link href="/mortgage-affordability-calculator">mortgage affordability calculator</Link> and the{" "}
        <Link href="/loan-to-income-calculator">loan-to-income calculator</Link>, and compare a salary-only figure
        with the <Link href="/salary-calculator">salary calculator</Link>.
      </p>

      <h3>What should you do next?</h3>
      <p>
        Work out what you take home at a few different pay levels, then confirm the tax position with an
        accountant before deciding anything. This is general information, not tax or financial advice.
      </p>
    </>
  );
}
