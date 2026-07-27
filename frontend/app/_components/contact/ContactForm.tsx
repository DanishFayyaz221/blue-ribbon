"use client";

import { useState } from "react";
import { api } from "@/lib/api";

const fields = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: false },
  { name: "subject", label: "Subject (optional)", type: "text", required: false },
] as const;

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const update = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const subject = values.subject?.trim();
      const combinedMessage = subject
        ? `Subject: ${subject}\n\n${message}`
        : message;
      await api.submitContact({
        name: values.name ?? "",
        email: values.email ?? "",
        phone: values.phone ?? undefined,
        message: combinedMessage,
      });
      setStatus("success");
      setValues({});
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="w-full rounded-[10px] border border-brand-navy/20 bg-brand-soft p-[24px] text-center">
        <p className="font-display text-[16px] font-semibold text-brand-navy">Thanks — message received.</p>
        <p className="mt-2 font-display text-[14px] text-brand-bunker/80">
          One of our agents will be in touch shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 font-display text-[13px] font-medium text-brand-navy underline underline-offset-4"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-[16px]">
      {fields.map((f) => (
        <input
          key={f.name}
          type={f.type}
          placeholder={f.label}
          required={f.required}
          value={values[f.name] ?? ""}
          onChange={update(f.name)}
          className="h-[52px] w-full rounded-[10px] border border-brand-silver bg-white px-[18px] font-display text-[14px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none"
        />
      ))}
      <textarea
        placeholder="Message"
        rows={5}
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full resize-none rounded-[10px] border border-brand-silver bg-white px-[18px] py-[16px] font-display text-[14px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none"
      />
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
      {errorMsg && (
        <p className="font-display text-[13px] text-red-600">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-[8px] flex h-[60px] w-full max-w-[180px] items-center justify-center rounded-[14px] bg-brand-navy font-display text-[15px] font-medium text-white transition hover:bg-brand-navy-deep disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
