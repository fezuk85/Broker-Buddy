import Link from "next/link";

export function AffordabilityGuide() {
  return (
    <>
      <h2>How much can you borrow for a mortgage?</h2>
      <p>
        Most UK lenders start from your <strong>income</strong>. As a rule of thumb, the maximum loan is a multiple
        of your combined gross annual income — typically around <strong>4 to 4.5 times</strong> income, with some
        lenders stretching to 5 or 5.5 times for higher earners or professions they favour. Bank of England policy
        limits the share of a lender&apos;s new mortgages that can be at 4.5 times income or more, which is why the
        higher multiples are less common and reserved for stronger applications.
      </p>

      <h3>Why the multiple isn&apos;t the whole story</h3>
      <p>
        A lender then runs its own <strong>affordability assessment</strong>. It looks at your regular outgoings,
        debts such as loans, credit cards and car finance, childcare, dependants and more, and checks that you could
        still afford the payments if interest rates rose. Two applicants on the same salary can be offered very
        different amounts. Larger existing commitments, more dependants, or a shorter term will generally reduce what
        a lender will offer.
      </p>

      <div className="worked-example">
        <p><strong>Worked example: two applicants earning £50,000 and £30,000</strong></p>
        <ul>
          <li>Combined income: £80,000.</li>
          <li>At 4.5 times income: £80,000 × 4.5 = <strong>£360,000</strong> maximum borrowing.</li>
          <li>With a £40,000 deposit, that supports a purchase price of about <strong>£400,000</strong> (90% LTV).</li>
          <li>
            Repayment mortgage over 25 years at 5%: about <strong>£2,105 a month</strong>. Stress-tested at 8%
            (3 percentage points higher) the payment would be about <strong>£2,779 a month</strong>.
          </li>
          <li>At 4 times income the maximum would be £320,000; at 5 times it would be £400,000.</li>
        </ul>
      </div>

      <h3>Ways to increase how much you can borrow</h3>
      <ul>
        <li>Pay off or reduce credit cards, loans and car finance before applying.</li>
        <li>Choose a longer term (this lowers the monthly payment, though you pay more interest overall).</li>
        <li>Add a joint applicant whose income can be counted, where appropriate.</li>
        <li>Increase your deposit, which lowers the LTV and can open up better rates.</li>
        <li>Speak to a broker who knows which lenders accept your type of income, such as self-employed or contract earnings.</li>
      </ul>

      <h3>What to check next</h3>
      <p>
        Once you have a borrowing figure, see how it looks as a monthly payment with the{" "}
        <Link href="/mortgage-repayment-calculator">mortgage repayment calculator</Link>, check your deposit against
        the property price with the <Link href="/ltv-calculator">LTV calculator</Link>, and remember to budget for{" "}
        <Link href="/stamp-duty-calculator">stamp duty</Link> on top of the deposit. If you are a limited company
        director, your income for mortgage purposes may differ from your take-home — see the{" "}
        <Link href="/dividend-calculator">salary and dividend calculator</Link>.
      </p>
      <p>
        This calculator is a simple, transparent illustration of income multiples. It is not a lending decision or a
        mortgage offer, and no lender is bound to lend you the figure shown.
      </p>
    </>
  );
}
