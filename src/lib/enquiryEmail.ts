/**
 * Builds the mailto link used by every "Email Andrew" button and enquiry card, so the pre-filled
 * email asks for the same details everywhere. Only the page topic goes in the subject; the visitor
 * fills in the rest before sending.
 */
const BODY_LINES = [
  "Hello,",
  "",
  "I would like to talk through my situation. My details are below (rough figures are fine).",
  "",
  "Name:",
  "Best number or email to reach me:",
  "",
  "How much I would like to borrow:",
  "What it is for:",
  "Estimated property value:",
  "Current mortgage balance and lender:",
  "Property type (residential, buy-to-let or commercial):",
  "Gross annual income (and how long employed or self-employed):",
  "Credit history (good, fair or bad; any missed payments, defaults or CCJs):",
  "Anything else important, and why you are asking now:",
  "",
];

export function enquiryMailto(email: string, topic: string): string {
  const subject = encodeURIComponent(`Enquiry from lendingcalculator.co.uk: ${topic}`);
  const body = encodeURIComponent(BODY_LINES.join("\n"));
  return `mailto:${email}?subject=${subject}&body=${body}`;
}
