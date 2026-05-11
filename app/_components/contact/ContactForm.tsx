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
      <label className="flex items-center gap-[10px] text-brand-bunker/70">
        <input type="checkbox" className="h-[16px] w-[16px] rounded" />
        <span className="font-display text-[12px]">I&rsquo;m not a robot</span>
      </label>
      <button
        type="submit"
        className="mt-[8px] flex h-[52px] w-full max-w-[220px] items-center justify-center rounded-[12px] bg-brand-navy font-display text-[15px] font-medium text-white transition hover:bg-brand-navy-deep"
      >
        Send Message
      </button>
    </form>
  );
}
