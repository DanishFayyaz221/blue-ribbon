import type { Request, Response, NextFunction } from "express";
import { AgentboxError } from "../agentbox/client.js";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ ok: false, error: "not_found" });
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  if (err instanceof AgentboxError) {
    // 401/403 from Agentbox: credential or IP problem — bubble as 502 so it's
    // clear the failure is upstream, not with our request.
    res.status(502).json({
      ok: false,
      error: "agentbox_error",
      upstreamStatus: err.status,
      upstreamBody: err.body,
      message: err.message,
    });
    return;
  }
  console.error(`[${req.method} ${req.originalUrl}]`, err);
  res.status(500).json({
    ok: false,
    error: "internal_error",
    message: err instanceof Error ? err.message : "Unknown error",
  });
}
