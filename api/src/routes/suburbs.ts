import { Router } from "express";
import { agentboxList } from "../agentbox/helpers.js";
import { asyncHandler } from "../middleware/async-handler.js";

type RawSuburb = {
  id?: string;
  name?: string;
  postcode?: string;
  state?: string;
};

const ONE_DAY = 24 * 60 * 60 * 1000;

export const suburbsRouter = Router();

suburbsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const search = req.query.q ? String(req.query.q).toLowerCase() : undefined;
    const state = (req.query.state as string | undefined) ?? "NSW";

    const filter: Record<string, string> = { state };
    if (search) filter.suburbName = search;

    const { items } = await agentboxList<RawSuburb>("/suburbs", "suburbs", {
      ttlMs: ONE_DAY,
      limit: 500,
      filter,
    });
    res.json({ ok: true, items });
  }),
);
