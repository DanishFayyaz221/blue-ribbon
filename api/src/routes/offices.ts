import { Router } from "express";
import { agentboxList, agentboxGet } from "../agentbox/helpers.js";
import { asyncHandler } from "../middleware/async-handler.js";

type RawOffice = {
  id: string;
  name: string;
  status?: string;
  address?: {
    streetAddress?: string;
    suburb?: string;
    state?: string;
    postcode?: string;
  };
  email?: string;
  phone?: string;
  website?: string;
};

function mapOffice(o: RawOffice) {
  return {
    id: o.id,
    name: o.name,
    email: o.email ?? null,
    phone: o.phone ?? null,
    website: o.website ?? null,
    address: [
      o.address?.streetAddress,
      o.address?.suburb,
      o.address?.state,
      o.address?.postcode,
    ]
      .filter(Boolean)
      .join(", "),
  };
}

export const officesRouter = Router();

officesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const { items, pagination } = await agentboxList<RawOffice>("/offices", "offices");
    res.json({ ok: true, items: items.map(mapOffice), pagination });
  }),
);

officesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const item = await agentboxGet<RawOffice>(`/offices/${req.params.id}`, "office");
    if (!item) {
      res.status(404).json({ ok: false, error: "not_found" });
      return;
    }
    res.json({ ok: true, item: mapOffice(item) });
  }),
);
