import type { Request, Response, NextFunction, RequestHandler } from "express";

// Express 4 doesn't auto-catch rejected promises from async handlers.
// Wrap with this so thrown errors reach the error middleware.
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
