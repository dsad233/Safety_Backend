import { Request, Response, NextFunction, RequestHandler } from "express";

export function Wrapper(func: RequestHandler): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await func(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
