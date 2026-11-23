import type { Request, Response } from "express";
import type { HttpError } from "http-errors";
import { StatusCodes } from "http-status-codes";

export function ErrorMiddleware(
  err: HttpError,
  req: Request,
  res: Response,
): Response<{ message: string }> | Record<string, any> {
  return res
    .status(err.status || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message || "서버에 오류가 발생하였습니다." });
}
