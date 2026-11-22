import Link from "next/link";

/**
 * "Talk to us" button. Opens an email to NEXT_PUBLIC_ENQUIRY_EMAIL when it is set; otherwise falls back to
 * the Contact page so the button never points nowhere.
 */
export function TalkButton({
  topic = "Homepage",
  className = "",
  children = "Talk to us",
}: {
  topic?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const email = process.env.NEXT_PUBLIC_ENQUIRY_EMAIL;
  const style = { background: "var(--bb-primary)" };
  const cls = `bb-tap-target inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white shrink-0 ${className}`;
  if (!email) {
    return (
      <Link href="/contact-us" className={cls} style={style}>
        {children}
      </Link>
    );
  }
  const subject = encodeURIComponent(`Enquiry from lendingcalculator.co.uk: ${topic}`);
  const body = encodeURIComponent(
    "Hello,\n\nI would like to talk through my situation.\n\nMy name:\nBest number or email to reach me:\nWhat I would like to borrow and why (roughly):\nAnything that has made this difficult so far:\n"
  );
  return (
    <a href={`mailto:${email}?subject=${subject}&body=${body}`} className={cls} style={style}>
      {children}
    </a>
  );
}
