"use client";

import { useState } from "react";
import { STUDIO_EMAIL, sendAdminNotification, sendVisitorAutoReply } from "@/lib/email/send";

type Variant = "card" | "pill";

const cardFields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "subject", label: "Subject (optional)", type: "text" },
];

const pillFields = [
  { name: "name", label: "Full Name", type: "text" },
  { name: "email", label: "Email Address", type: "email" },
  { name: "phone", label: "Phone Number", type: "tel" },
];

/**
 * The "reach out" form on the contact page. `card` is the bordered desktop
 * version; `pill` matches the rounded grey styling of the mobile layout.
 * Both send the same notification to the studio via EmailJS.
 */
export function ContactForm({ variant = "card" }: { variant?: Variant }) {
  const pill = variant === "pill";
  const fields = pill ? pillFields : cardFields;

  const [values, setValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const update = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [name]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const name = values.name ?? "";
    const email = values.email ?? "";
    // The template only renders variables it references; fold every field into
    // the message body so all of them reach the inbox regardless.
    const extras = [
      `Name: ${name}`,
      `Email: ${email}`,
      values.phone ? `Phone: ${values.phone}` : null,
      values.subject ? `Subject: ${values.subject}` : null,
    ].filter(Boolean);
    try {
      await sendAdminNotification({
        form_type: "Contact request",
        name,
        from_name: name,
        email,
        from_email: email,
        reply_to: email,
        phone: values.phone,
        subject: values.subject,
        message: `${message}\n\n----------------------------\n${extras.join("\n")}`,
      });
      // Fire-and-forget: the message is already in, see sendVisitorAutoReply.
      void sendVisitorAutoReply({ name, to_name: name, email, to_email: email });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const inputClass = pill
    ? "h-[44px] w-full rounded-[22px] bg-[#F1F2F4] px-[18px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
    : "h-[52px] w-full rounded-[26px] border border-brand-silver bg-white px-[22px] font-display text-[14px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none";
  const textareaClass = pill
    ? "w-full resize-none rounded-[18px] bg-[#F1F2F4] px-[18px] py-[12px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
    : "w-full resize-none rounded-[24px] border border-brand-silver bg-white px-[22px] py-[16px] font-display text-[14px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none";

  if (status === "sent") {
    return (
      <div
        className={
          pill
            ? "rounded-[18px] bg-[#F1F2F4] p-[20px]"
            : "rounded-[10px] border border-brand-silver bg-white p-[24px]"
        }
      >
        <p className="font-display text-[16px] font-bold text-brand-navy">Message sent ✓</p>
        <p className="mt-[8px] font-display text-[13px] leading-[1.6] text-brand-bunker/80">
          Thanks{values.name ? `, ${values.name}` : ""} — we&rsquo;ve received your message
          and will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex w-full flex-col ${pill ? "gap-[10px]" : "gap-[16px]"}`}>
      {fields.map((f) => (
        <input
          key={f.name}
          type={f.type}
          placeholder={f.label}
          value={values[f.name] ?? ""}
          onChange={update(f.name)}
          required={f.name !== "subject"}
          className={inputClass}
        />
      ))}
      <textarea
        placeholder={pill ? "Your Message" : "Message"}
        rows={pill ? 4 : 5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        className={textareaClass}
      />

      {!pill && (
        <div className="flex w-[304px] items-center justify-between rounded-[6px] border border-[#d3d3d3] bg-[#f9f9f9] px-[14px] py-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <label className="flex cursor-pointer items-center gap-[12px]">
            <input
              type="checkbox"
              className="h-[26px] w-[26px] cursor-pointer appearance-none rounded-[2px] border-2 border-[#c1c1c1] bg-white checked:border-brand-navy checked:bg-brand-navy"
            />
            <span className="font-display text-[14px] text-[#000000]">I&rsquo;m not a robot</span>
          </label>
          <div className="flex flex-col items-center gap-[3px] pl-[10px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
              alt="reCAPTCHA"
              width={32}
              height={32}
            />
            <span className="font-display text-[10px] leading-none text-[#555555]">reCAPTCHA</span>
          </div>
        </div>
      )}

      {status === "error" && (
        <p className="font-display text-[12px] leading-[1.5] text-red-600">
          Sorry, your message could not be sent. Please try again
          {STUDIO_EMAIL ? (
            <>
              {" "}or email us directly at{" "}
              <a href={`mailto:${STUDIO_EMAIL}`} className="font-semibold underline">
                {STUDIO_EMAIL}
              </a>
            </>
          ) : null}
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className={
          pill
            ? "mt-[4px] h-[44px] w-full rounded-[22px] bg-brand-navy font-display text-[13px] font-semibold text-white transition hover:bg-brand-navy-deep disabled:opacity-50"
            : "mt-[8px] flex h-[60px] w-full max-w-[180px] items-center justify-center rounded-[14px] bg-brand-navy font-display text-[15px] font-medium text-white transition hover:bg-brand-navy-deep disabled:opacity-50"
        }
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
