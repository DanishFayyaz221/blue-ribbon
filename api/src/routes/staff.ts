import { Router } from "express";
import { agentboxList, agentboxGet } from "../agentbox/helpers.js";
import { asyncHandler } from "../middleware/async-handler.js";

// Loose type — Agentbox staff fields vary by config, we'll adjust once we see
// a real response.
type RawStaff = {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  jobTitle?: string;
  role?: string;
  position?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  photo?: string | { url?: string };
  imageURL?: string;
  image?: string;
  officeId?: string;
  status?: string;
};

function extractImage(s: RawStaff): string | null {
  if (typeof s.photo === "string") return s.photo;
  if (typeof s.photo === "object" && s.photo?.url) return s.photo.url;
  if (s.imageURL) return s.imageURL;
  if (s.image) return s.image;
  return null;
}

function mapStaff(s: RawStaff) {
  const name =
    s.fullName ||
    [s.firstName, s.lastName].filter(Boolean).join(" ") ||
    "Staff";
  return {
    id: s.id,
    name,
    role: s.jobTitle ?? s.role ?? s.position ?? "",
    image: extractImage(s),
    email: s.email ?? null,
    mobile: s.mobile ?? s.phone ?? null,
    officeId: s.officeId ?? null,
  };
}

export const staffRouter = Router();

staffRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const officeId =
      (req.query.officeId as string | undefined) ?? process.env.BLUE_RIBBON_OFFICE_ID;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const { items, pagination } = await agentboxList<RawStaff>("/staff", "staffMembers", {
      page,
      limit,
      filter: officeId ? { officeId } : undefined,
    });
    res.json({ ok: true, items: items.map(mapStaff), pagination });
  }),
);

staffRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const item = await agentboxGet<RawStaff>(`/staff/${req.params.id}`, "staffMember");
    if (!item) {
      res.status(404).json({ ok: false, error: "not_found" });
      return;
    }
    res.json({ ok: true, item: mapStaff(item) });
  }),
);
