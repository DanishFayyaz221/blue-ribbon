"use client";

import { useId, useRef, useState } from "react";
import { STUDIO_EMAIL, sendAdminNotification, sendVisitorAutoReply } from "@/lib/email/send";
import { useInViewOnce } from "../ui/MaskReveal";

type Variant = "card" | "pill" | "team";

const cardFields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "subject", label: "Subject (optional)", type: "text" },
];

/** The Our Team page's form: the card layout, asking for a property address
 *  instead of a subject. Optional, like the subject it replaces. */
const teamFields = [
  ...cardFields.slice(0, 3),
  { name: "address", label: "Property Address", type: "text" },
];

const pillFields = [
  { name: "name", label: "Full Name", type: "text" },
  { name: "email", label: "Email Address", type: "email" },
  { name: "phone", label: "Phone Number", type: "tel" },
];

/**
 * The "reach out" form on the contact page. `card` is the bordered desktop
 * version; `pill` matches the rounded grey styling of the mobile layout;
 * `team` is the card layout with a property-address field, for the Our Team
 * page. All send the same notification to the studio via EmailJS.
 */
export function ContactForm({ variant = "card" }: { variant?: Variant }) {
  const pill = variant === "pill";
  const fields = pill ? pillFields : variant === "team" ? teamFields : cardFields;

  const [values, setValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // The field labels play the site's line reveal as the form scrolls in, on
  // one trigger for the whole form so they stagger down the column.
  const formRef = useRef<HTMLFormElement>(null);
  const inView = useInViewOnce(formRef);
  // The contact page renders two of these forms (pill and card), so the
  // label-to-field ids must be unique per instance.
  const uid = useId();

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
      values.address ? `Property Address: ${values.address}` : null,
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
      // No listing and no named agent here, so the template's property and
      // agent sections gate themselves off — see lib/email/templates/reply.html.
      void sendVisitorAutoReply({
        to_email: email,
        to_name: name.split(" ")[0] || name,
        intro_line: values.subject
          ? `We've received your message about "${values.subject}", and it has gone straight to our team.`
          : "We've received your message, and it has gone straight to our team.",
        message: message || undefined,
        // Pinned to the live site, not the composing origin — a localhost link
        // in a real inbox is dead. See EnquiryModal for the full reasoning.
        cta_url: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/buy`,
        cta_label: "Browse our listings",
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const inputClass = pill
    ? "peer h-[44px] w-full rounded-[22px] bg-[#F1F2F4] px-[18px] font-display text-[13px] text-brand-bunker focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
    : "peer h-[52px] w-full rounded-[26px] border border-brand-silver bg-white px-[22px] font-display text-[14px] text-brand-bunker focus:border-brand-navy focus:outline-none";
  const textareaClass = pill
    ? "peer w-full resize-none rounded-[18px] bg-[#F1F2F4] px-[18px] py-[12px] font-display text-[13px] text-brand-bunker focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
    : "peer w-full resize-none rounded-[24px] border border-brand-silver bg-white px-[22px] py-[16px] font-display text-[14px] text-brand-bunker focus:border-brand-navy focus:outline-none";

  /**
   * The "placeholder": a <label> laid over the field where the placeholder
   * text would sit, styled to match it. Not the native attribute, because a
   * browser paints that itself and `::placeholder` takes colour and font
   * only — no transform, no clip — so it cannot slide up behind a line mask.
   *
   * It behaves like a placeholder all the same: visible while the field is
   * empty (focused or not), gone the moment there is a value. Gone by
   * opacity, not display, so the input keeps the label as its accessible
   * name after it is filled in; the `peer-autofill` case covers a browser
   * autofill that lands without firing onChange. Clicks fall through to the
   * field underneath.
   */
  const ghostClass = pill
    ? "font-display text-[13px] text-brand-bunker/50"
    : "font-display text-[14px] text-brand-bunker/40";
  const ghost = (htmlFor: string, text: string, empty: boolean, i: number, place: string) => (
    <span
      className={`lr lr-ready${inView ? " lr-in" : ""} pointer-events-none absolute ${place} peer-autofill:opacity-0 ${
        empty ? "" : "opacity-0"
      }`}
    >
      <span className="lr-mask">
        <label
          htmlFor={htmlFor}
          className={`lr-line ${ghostClass}`}
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          {text}
        </label>
      </span>
    </span>
  );
  // Where the native placeholder sat: vertically centred in an input, on the
  // first line of a textarea. Offsets mirror the fields' own padding.
  const inputPlace = pill
    ? "inset-y-0 left-[18px] flex items-center"
    : "inset-y-0 left-[22px] flex items-center";
  const textareaPlace = pill ? "top-[12px] left-[18px]" : "top-[16px] left-[22px]";

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
        <p className="mt-[8px] font-display text-[13px] leading-[1.6] text-brand-bunker">
          Thanks{values.name ? `, ${values.name}` : ""} — we&rsquo;ve received your message
          and will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`flex w-full flex-col ${pill ? "gap-[10px]" : "gap-[16px]"}`}
    >
      {fields.map((f, i) => {
        const id = `${uid}-${f.name}`;
        return (
          // flex, so the field is blockified and the wrapper hugs it exactly —
          // an inline-level field would leave descender space below itself.
          <div key={f.name} className="relative flex">
            <input
              id={id}
              type={f.type}
              value={values[f.name] ?? ""}
              onChange={update(f.name)}
              required={f.name !== "subject" && f.name !== "address"}
              className={inputClass}
            />
            {ghost(id, f.label, !values[f.name], i, inputPlace)}
          </div>
        );
      })}
      <div className="relative flex">
        <textarea
          id={`${uid}-message`}
          rows={pill ? 4 : 5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className={textareaClass}
        />
        {ghost(
          `${uid}-message`,
          pill ? "Your Message" : "Message",
          !message,
          fields.length,
          textareaPlace,
        )}
      </div>

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
