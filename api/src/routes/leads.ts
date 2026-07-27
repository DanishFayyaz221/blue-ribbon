import { Router } from "express";
import type { Request, Response } from "express";
import { agentboxRequest, AgentboxError } from "../agentbox/client.js";
import { withRateLimit } from "../agentbox/rate-limit.js";
import { asyncHandler } from "../middleware/async-handler.js";

// Agentbox POST /enquiries schema (from swagger.yaml):
//   { enquiry: { comment, date?, type?, source?, attachedContact, attachedListing?, attachedProject?, prospectiveBuyerDetails? } }
// - `type` / `source` are the NAMES from /enquiry-types & /enquiry-sources (not IDs).
// - `attachedContact.id` uses an existing contact; otherwise Agentbox matches by
//   email/mobile and creates one if no match — so we never need a separate
//   POST /contacts call.

type AttachedContact = {
  firstName: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  source?: string;
  actions?: {
    attachListingAgents?: boolean;
    addDefaultContactClasses?: boolean;
    addDefaultSubscriptions?: boolean;
    addDefaultRequirements?: boolean;
  };
};

type EnquiryPayload = {
  enquiry: {
    comment: string;
    date?: string;
    type?: string;
    source?: string;
    attachedContact: AttachedContact;
    attachedListing?: { id: string };
    attachedProject?: { id: string };
  };
};

async function postEnquiry(payload: EnquiryPayload) {
  return withRateLimit(async () =>
    agentboxRequest<{
      response?: { status?: string; enquiry?: { id?: number; links?: { self?: string } } };
    }>("/enquiries", { method: "POST", body: payload }),
  );
}

function splitName(fullName: string): { firstName: string; lastName?: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: "Website Enquiry" };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0]! };
  return { firstName: parts[0]!, lastName: parts.slice(1).join(" ") };
}

function requireString(v: unknown, field: string): string {
  if (typeof v !== "string" || !v.trim()) {
    throw Object.assign(new Error(`Missing required field: ${field}`), { statusCode: 400 });
  }
  return v.trim();
}

export const leadsRouter = Router();

// General contact form (contact page)
leadsRouter.post(
  "/contact",
  asyncHandler(async (req: Request, res: Response) => {
    const { fullName, name, email, phone, mobile, message } = req.body ?? {};
    const nameStr = requireString(fullName ?? name, "name");
    const emailStr = requireString(email, "email");
    const messageStr = requireString(message, "message");
    const mobileStr = mobile ?? phone;

    const { firstName, lastName } = splitName(nameStr);

    const result = await postEnquiry({
      enquiry: {
        comment: messageStr,
        type: "General Enquiry",
        source: "Website",
        attachedContact: {
          firstName,
          lastName,
          email: emailStr,
          mobile: typeof mobileStr === "string" ? mobileStr : undefined,
          source: "Website",
          actions: {
            addDefaultContactClasses: true,
            addDefaultSubscriptions: true,
          },
        },
      },
    });

    res.status(201).json({ ok: true, enquiryId: result?.response?.enquiry?.id ?? null });
  }),
);

// Property enquiry (enquiry modal on /property/[id])
leadsRouter.post(
  "/enquiry",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      firstName: fn,
      lastName: ln,
      fullName,
      email,
      mobile,
      message,
      listingId,
      helpTopic,
    } = req.body ?? {};

    const emailStr = requireString(email, "email");
    const listingIdStr = requireString(listingId, "listingId");
    const firstName = (fn ?? (fullName ? splitName(fullName).firstName : "")) as string;
    const lastName = (ln ?? (fullName ? splitName(fullName).lastName : undefined)) as
      | string
      | undefined;
    if (!firstName?.trim()) {
      res.status(400).json({ ok: false, error: "missing_first_name" });
      return;
    }

    const commentParts: string[] = [];
    if (helpTopic) commentParts.push(`Help requested: ${helpTopic}`);
    if (message) commentParts.push(String(message));
    const comment = commentParts.join("\n\n") || "Website property enquiry";

    const result = await postEnquiry({
      enquiry: {
        comment,
        type: "Buyer Enquiry",
        source: "Website",
        attachedContact: {
          firstName: firstName.trim(),
          lastName: lastName?.trim(),
          email: emailStr,
          mobile: typeof mobile === "string" ? mobile : undefined,
          source: "Website",
          actions: {
            attachListingAgents: true,
            addDefaultContactClasses: true,
            addDefaultSubscriptions: true,
          },
        },
        attachedListing: { id: listingIdStr },
      },
    });

    res.status(201).json({ ok: true, enquiryId: result?.response?.enquiry?.id ?? null });
  }),
);

// Appraisal request (digital appraisal flow, sales or rental)
leadsRouter.post(
  "/appraisal",
  asyncHandler(async (req: Request, res: Response) => {
    const { fullName, name, email, mobile, phone, address, intent, reportType, estimatedValue } =
      req.body ?? {};

    const nameStr = requireString(fullName ?? name, "name");
    const emailStr = requireString(email, "email");
    const addressStr = requireString(address, "address");
    const mobileStr = mobile ?? phone;
    const { firstName, lastName } = splitName(nameStr);

    const isRental = reportType === "rental";
    const enquiryType = isRental ? "Tenant Enquiry" : "Vendor Enquiry";

    const commentLines = [
      `Digital appraisal request (${isRental ? "Rental" : "Sales"})`,
      `Address: ${addressStr}`,
    ];
    if (intent) commentLines.push(`Intent: ${intent}`);
    if (estimatedValue) commentLines.push(`Estimated value (LeadPlus): ${estimatedValue}`);

    const result = await postEnquiry({
      enquiry: {
        comment: commentLines.join("\n"),
        type: enquiryType,
        source: "Website",
        attachedContact: {
          firstName,
          lastName,
          email: emailStr,
          mobile: typeof mobileStr === "string" ? mobileStr : undefined,
          source: "Website",
          actions: {
            addDefaultContactClasses: true,
            addDefaultSubscriptions: true,
          },
        },
      },
    });

    res.status(201).json({ ok: true, enquiryId: result?.response?.enquiry?.id ?? null });
  }),
);

// Passthrough for handlers to identify Agentbox errors up the stack.
export { AgentboxError };
