"use client";

import { useState } from "react";
import { Field, TextInput } from "@/components/Field";
import { Section } from "@/components/Section";

const CONTACT_EMAIL = "fezuk85@googlemail.com";

export default function ContactUsClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const canSend = name.trim() && email.trim() && message.trim();

  function buildMailtoHref() {
    const bodyLines = [message.trim(), "", `Name: ${name.trim()}`, `Email: ${email.trim()}`];
    const params = new URLSearchParams({
      subject: subject.trim() || "Message from Lending Calculator contact form",
      body: bodyLines.join("\n"),
    });
    return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
  }

  return (
    <Section title="Send a message">
      <form
        className="grid grid-cols-1 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSend) return;
          window.location.href = buildMailtoHref();
        }}
      >
        <Field label="Your name">
          <TextInput value={name} onChange={setName} placeholder="Jane Smith" />
        </Field>
        <Field label="Your email">
          <TextInput value={email} onChange={setEmail} placeholder="jane@example.com" />
        </Field>
        <Field label="Subject (optional)">
          <TextInput value={subject} onChange={setSubject} placeholder="What's this about?" />
        </Field>
        <label className="block">
          <span className="block text-sm font-medium text-[var(--bb-foreground)]">Message</span>
          <textarea
            className="mt-1 w-full rounded-lg border border-[var(--bb-border)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--bb-primary)]/40 focus:border-[var(--bb-primary)]"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help?"
          />
        </label>
        <button
          type="submit"
          disabled={!canSend}
          className="bb-tap-target inline-flex w-fit items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          style={{ background: "var(--bb-primary)" }}
        >
          Send message
        </button>
        <p className="text-xs text-[var(--bb-muted)]">
          Sending opens your own email app with the message pre-filled, addressed to us — we
          don&apos;t store or process form submissions on a server.
        </p>
      </form>
    </Section>
  );
}
