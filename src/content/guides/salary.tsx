import Link from "next/link";

export function SalaryGuide() {
  return (
    <>
      <h2>How is take-home pay calculated from a UK salary?</h2>
      <p>
        Your take-home pay is your gross salary minus income tax and employee National Insurance (NI). Both are
        charged in <strong>slices</strong>, so a pay rise never drops your whole salary into a higher rate: only the
        part above each threshold is taxed at the higher rate. The figures on this page are for the{" "}
        <strong>2026/27 tax year in England, Wales and Northern Ireland</strong> and can change at any Budget.
      </p>

      <h3>What are the income tax bands for 2026/27?</h3>
      <table>
        <thead>
          <tr>
            <th>Slice of income</th>
            <th>Income tax rate</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Up to £12,570 (personal allowance)</td><td>0%</td></tr>
          <tr><td>£12,571 to £50,270</td><td>20%</td></tr>
          <tr><td>£50,271 to £125,140</td><td>40%</td></tr>
          <tr><td>Above £125,140</td><td>45%</td></tr>
        </tbody>
      </table>
      <p>
        The personal allowance shrinks by £1 for every £2 of income above £100,000 and is gone entirely at £125,140.
        That is why the effective rate between £100,000 and £125,140 is higher than 40%.
      </p>

      <h3>How much National Insurance do employees pay?</h3>
      <p>
        Employee NI is <strong>8%</strong> on earnings between £12,570 and £50,270, and <strong>2%</strong> on
        anything above £50,270. It is separate from income tax and is not affected by the personal allowance taper.
      </p>

      <div className="worked-example">
        <p><strong>Worked example: a £40,000 salary</strong></p>
        <ul>
          <li>Taxable income: £40,000 minus the £12,570 allowance = £27,430, all in the 20% band.</li>
          <li>Income tax: 20% of £27,430 = <strong>£5,486</strong>.</li>
          <li>National Insurance: 8% of £27,430 = <strong>£2,194.40</strong>.</li>
          <li>
            Take-home: £40,000 minus £7,680.40 = <strong>£32,319.60 a year</strong>, or about{" "}
            <strong>£2,693 a month</strong> (an effective rate of about 19.2%).
          </li>
        </ul>
        <p>Assumes a standard tax code, no pension, no student loan and no benefits in kind.</p>
      </div>

      <h3>What does this calculator not include?</h3>
      <p>
        It ignores pension contributions, student loan repayments, Scottish income tax bands, Marriage Allowance,
        salary sacrifice and taxable benefits such as a company car. Any of these can change your real pay, and your
        payslip may differ slightly because of tax codes and pay-period rounding.
      </p>

      <h3>How do mortgage lenders treat your salary?</h3>
      <p>
        Lenders base affordability on your <strong>gross</strong> income, not take-home pay, and most multiply it by
        a set number of times to set a maximum loan. Many lenders will also count regular bonuses, overtime or
        commission, but usually only part of it and often only after a track record of a year or more. Exactly how
        much varies by lender. To see what a salary might support, try the{" "}
        <Link href="/mortgage-affordability-calculator">mortgage affordability calculator</Link> or the{" "}
        <Link href="/loan-to-income-calculator">loan-to-income calculator</Link>.
      </p>

      <h3>What should you do next?</h3>
      <p>
        Compare your net monthly figure with your outgoings, then see how a possible mortgage payment fits using the{" "}
        <Link href="/mortgage-repayment-calculator">mortgage repayment calculator</Link>. Lenders also look at
        your debts and spending, not just your income. This is information, not advice; for your own tax position,
        check your payslip or speak to an accountant.
      </p>
    </>
  );
}
