/**
 * "Talk it through" enquiry card. Renders nothing unless NEXT_PUBLIC_ENQUIRY_EMAIL is set, so
 * nothing ships until the firm's compliance team has approved the wording and the address.
 * The mailto link carries only a subject line naming the page the visitor was reading.
 */
export function EnquiryCta({ topic }: { topic: string }) {
  const email = process.env.NEXT_PUBLIC_ENQUIRY_EMAIL;
  if (!email) return null;

  const subject = encodeURIComponent(`Enquiry from lendingcalculator.co.uk: ${topic}`);
  const body = encodeURIComponent(
    "Hello,\n\nI read the page above and would like to talk through my situation.\n\nMy name:\nBest number or email to reach me:\nWhat I would like to borrow and why (roughly):\nAnything that has made this difficult so far:\n"
  );

  return (
    <aside className="bb-card p-5 sm:p-6" aria-label="Talk your situation through with a specialist">
      <h2 className="text-base font-semibold">Want to talk it through?</h2>
      <p className="mt-1 text-sm text-[var(--bb-muted)]">
        If your situation does not fit a standard mortgage, send a few details and a member of our specialist
        lending team will come back to you.
      </p>
      <a
        href={`mailto:${email}?subject=${subject}&body=${body}`}
        className="bb-tap-target mt-3 inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white"
        style={{ background: "var(--bb-primary)" }}
      >
        Email us your situation
      </a>
      <p className="mt-3 text-xs text-[var(--bb-muted)]">
        Your home may be repossessed if you do not keep up repayments on your mortgage or any other debt secured on it.
      </p>
    </aside>
  );
}
