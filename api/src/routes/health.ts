import { Router } from "express";
import { agentboxList } from "../agentbox/helpers.js";
import { asyncHandler } from "../middleware/async-handler.js";

export const healthRouter = Router();

healthRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const { items, pagination } = await agentboxList<{ id: string; name: string }>(
      "/offices",
      "offices",
      { ttlMs: 60_000 },
    );
    res.json({
      ok: true,
      agentbox: {
        reachable: true,
        offices: items.length,
      },
      pagination,
    });
  }),
);
