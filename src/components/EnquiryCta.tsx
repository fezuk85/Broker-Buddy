/**
 * "Talk it through" enquiry card. Renders nothing unless NEXT_PUBLIC_ENQUIRY_EMAIL is set.
 * The mailto link carries only a subject line naming the page the visitor was reading.
 * variant="compact" is a one-line strip for the top of a guide; "full" is the card at the end.
 */
export function EnquiryCta({ topic, variant = "full" }: { topic: string; variant?: "full" | "compact" }) {
  const email = process.env.NEXT_PUBLIC_ENQUIRY_EMAIL;
  if (!email) return null;

  const subject = encodeURIComponent(`Enquiry from lendingcalculator.co.uk: ${topic}`);
  const body = encodeURIComponent(
    "Hello,\n\nI read the page above and would like to talk through my situation.\n\nMy name:\nBest number or email to reach me:\nWhat I would like to borrow and why (roughly):\nAnything that has made this difficult so far:\n"
  );
  const href = `mailto:${email}?subject=${subject}&body=${body}`;

  if (variant === "compact") {
    return (
      <div className="bb-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
        <p className="text-sm">
          <span className="font-semibold">Not sure which route fits?</span>{" "}
          <span className="text-[var(--bb-muted)]">Send a few details and we&apos;ll point you the right way.</span>
        </p>
        <a
          href={href}
          className="bb-tap-target inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white"
          style={{ background: "var(--bb-primary)" }}
        >
          Email us your situation
        </a>
      </div>
    );
  }

  return (
    <aside className="bb-card p-5 sm:p-6" aria-label="Talk your situation through with us">
      <h2 className="text-base font-semibold">Want to talk it through?</h2>
      <p className="mt-1 text-sm text-[var(--bb-muted)]">
        Send a few details and we&apos;ll point you to the right route: a standard mortgage broker if that suits you
        best, or a specialist lender if your case needs one.
      </p>
      <a
        href={href}
        className="bb-tap-target mt-3 inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white"
        style={{ background: "var(--bb-primary)" }}
      >
        Email us your situation
      </a>
      <p className="mt-3 text-xs text-[var(--bb-muted)]">
        We only pass your details to another broker after we have spoken to you and you have agreed. Your home may be
        repossessed if you do not keep up repayments on your mortgage or any other debt secured on it.
      </p>
    </aside>
  );
}
