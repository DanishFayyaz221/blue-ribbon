"use client";

import { useState } from "react";
import { api } from "@/lib/api";

type Status = "idle" | "submitting" | "success" | "error";

export function MobileContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg(null);
    try {
      await api.submitContact({ name, email, phone: phone || undefined, message });
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-[22px] bg-[#F1F2F4] p-[20px] text-center">
        <p className="font-display text-[14px] font-semibold text-brand-navy">Message sent</p>
        <p className="mt-1 font-display text-[12.5px] text-brand-bunker/70">
          One of our agents will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[10px]">
      <input
        type="text"
        required
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-[44px] w-full rounded-[22px] bg-[#F1F2F4] px-[18px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
      />
      <input
        type="email"
        required
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-[44px] w-full rounded-[22px] bg-[#F1F2F4] px-[18px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="h-[44px] w-full rounded-[22px] bg-[#F1F2F4] px-[18px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
      />
      <textarea
        placeholder="Your Message"
        rows={4}
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full resize-none rounded-[18px] bg-[#F1F2F4] px-[18px] py-[12px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
      />
      {errorMsg && (
        <p className="font-display text-[12px] text-red-600">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-[4px] h-[44px] w-full rounded-[22px] bg-brand-navy font-display text-[13px] font-semibold text-white transition hover:bg-brand-navy-deep disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
