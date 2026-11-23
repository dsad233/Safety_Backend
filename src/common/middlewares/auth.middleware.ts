import type { NextFunction, Request, Response } from "express";
import { Unauthorized, BadRequest, NotFound } from "http-errors";
import { RedisService } from "../modules/redis.service";
import { PrefixType, TokenType } from "../libs/types";
import { JwtService } from "../modules/jwt.service";
import { db } from "../configs/db.config";
import { users } from "../../../schema/schema";
import { eq } from "drizzle-orm";

export async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.headers.authorization) {
    throw new Unauthorized("로그인 정보가 없습니다. 다시 로그인 해주세요.");
  }

  const token = existAccessToken(req.headers.authorization.split(" "));

  // 토큰 유효성 검증
  const verify = JwtService.verify(token, TokenType.ACCESS);

  // DB에 기존 데이터 조회
  const [user] = await db
    .select({
      id: users.id,
      nickname: users.nickname,
      email: users.email,
      loginId: users.loginId,
    })
    .from(users)
    .where(
      verify["email"]
        ? eq(users.email, verify["email"])
        : eq(users.loginId, verify["loginId"]),
    );

  if (!user) {
    throw new NotFound("유저 정보가 존재하지 않습니다. 다시 로그인 해주세요.");
  }

  // Redis와 토큰 비교
  if (
    token !==
    (await RedisService.get(
      `${PrefixType.SESSION}:${TokenType.ACCESS}:userId=${user.id}`,
    ))
  ) {
    throw new Unauthorized("세션이 일치하지 않습니다. 다시 로그인 해주세요.");
  }

  req.user = user;

  next();
}

// 토큰 유형 검증
function existAccessToken([type, token]: string[]): string {
  if (type?.toLowerCase() !== "bearer") {
    throw new BadRequest(
      "토큰 유형이 올바르지 않습니다. 다시 로그인 해주세요.",
    );
  }

  if (!token) {
    throw new NotFound("인증 정보가 올바르지 않습니다. 다시 로그인 해주세요.");
  }

  return token;
}
