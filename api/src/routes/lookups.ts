import { Router } from "express";
import { agentboxList } from "../agentbox/helpers.js";
import { asyncHandler } from "../middleware/async-handler.js";

const ONE_DAY = 24 * 60 * 60 * 1000;

// Bundle the Agentbox lookup endpoints into a single frontend-facing call so
// pages don't need to make 5 requests each. Each is cached for a day.
export const lookupsRouter = Router();

lookupsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [enquiryTypes, enquirySources, enquiryInterestLevels, contactClasses, contactSources, propertyTypes, regions] = await Promise.all([
      agentboxList<unknown>("/enquiry-types", "enquiryTypes", { ttlMs: ONE_DAY }),
      agentboxList<unknown>("/enquiry-sources", "enquirySources", { ttlMs: ONE_DAY }),
      agentboxList<unknown>("/enquiry-interest-levels", "enquiryInterestLevels", { ttlMs: ONE_DAY }),
      agentboxList<unknown>("/contact-classes", "contactClasses", { ttlMs: ONE_DAY }),
      agentboxList<unknown>("/contact-sources", "contactSources", { ttlMs: ONE_DAY }),
      agentboxList<unknown>("/property-types", "propertyTypes", { ttlMs: ONE_DAY }),
      agentboxList<unknown>("/regions", "regions", { ttlMs: ONE_DAY }),
    ]);
    res.json({
      ok: true,
      enquiryTypes: enquiryTypes.items,
      enquirySources: enquirySources.items,
      enquiryInterestLevels: enquiryInterestLevels.items,
      contactClasses: contactClasses.items,
      contactSources: contactSources.items,
      propertyTypes: propertyTypes.items,
      regions: regions.items,
    });
  }),
);
