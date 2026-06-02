"use client";

import { useState } from "react";

const fields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "subject", label: "Subject (optional)", type: "text" },
];

export function ContactForm() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const update = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [name]: e.target.value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex w-full flex-col gap-[16px]"
    >
      {fields.map((f) => (
        <input
          key={f.name}
          type={f.type}
          placeholder={f.label}
          value={values[f.name] ?? ""}
          onChange={update(f.name)}
          className="h-[52px] w-full rounded-[10px] border border-brand-silver bg-white px-[18px] font-display text-[14px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none"
        />
      ))}
      <textarea
        placeholder="Message"
        rows={5}
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
      <button
        type="submit"
        className="mt-[8px] flex h-[60px] w-full max-w-[180px] items-center justify-center rounded-[14px] bg-brand-navy font-display text-[15px] font-medium text-white transition hover:bg-brand-navy-deep"
      >
        Send Message
      </button>
    </form>
  );
}
