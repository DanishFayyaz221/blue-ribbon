/**
 * Browser-side email sending via the EmailJS REST API.
 *
 * Used from client components (enquiry modal, contact form). No SDK — the API
 * is a single JSON POST, and adding a dependency for that buys nothing.
 * Template params the template does not reference are ignored by EmailJS, so
 * senders can be generous with context (listing details, agent names).
 */

const ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

/** Fallback shown to the visitor when a send fails. */
export const STUDIO_EMAIL = process.env.NEXT_PUBLIC_STUDIO_EMAIL ?? "";

type TemplateParams = Record<string, string | undefined>;

async function send(templateId: string | undefined, params: TemplateParams): Promise<void> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !publicKey || !templateId) {
    throw new Error("EmailJS is not configured — set the NEXT_PUBLIC_EMAILJS_* env vars.");
  }

  const template_params: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value) template_params[key] = value;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params,
    }),
  });

  if (!res.ok) {
    throw new Error(`EmailJS ${res.status}: ${await res.text()}`);
  }
}

/** The enquiry/contact notification that reaches the studio inbox. */
export function sendAdminNotification(params: TemplateParams): Promise<void> {
  return send(process.env.NEXT_PUBLIC_EMAILJS_NOTIFY_TEMPLATE, {
    to_email: STUDIO_EMAIL,
    ...params,
  });
}

/**
 * The confirmation that reaches the visitor. Failures are deliberately
 * swallowed: by the time this fires the enquiry has already reached the
 * studio, and a broken auto-reply should not turn a successful submission
 * into an error screen.
 */
export async function sendVisitorAutoReply(params: TemplateParams): Promise<void> {
  try {
    await send(process.env.NEXT_PUBLIC_EMAILJS_REPLY_TEMPLATE, params);
  } catch {
    // Non-fatal by design.
  }
}
