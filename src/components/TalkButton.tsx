import Link from "next/link";
import { enquiryMailto } from "@/lib/enquiryEmail";

/**
 * "Talk to us" button. Opens an email to NEXT_PUBLIC_ENQUIRY_EMAIL when it is set; otherwise falls back to
 * the Contact page so the button never points nowhere.
 */
export function TalkButton({
  topic = "Homepage",
  className = "",
  children = "Email Andrew",
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

  return (
    <a href={enquiryMailto(email, topic)} className={cls} style={style}>
      {children}
    </a>
  );
}
