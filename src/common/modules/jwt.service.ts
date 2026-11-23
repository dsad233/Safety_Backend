import jwt, { SignOptions, JwtPayload as _JwtPayload } from "jsonwebtoken";
import { BadRequest, Unauthorized } from "http-errors";
import { TokenType } from "../libs/types";
import {
  JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_REFRESH_TOKEN_EXPIRES_IN,
  JWT_REFRESH_TOKEN_SECRET_KEY,
  JWT_SECRET_KEY,
} from "../configs/keys";

export type JwtPayload = {
  nickname: string;
  email?: string | undefined;
  loginId?: string | undefined;
};

export class JwtService {
  // 토큰 발급
  static sign = (payload: JwtPayload, tokenType: TokenType): string => {
    if (tokenType === TokenType.REFRESH) {
      return jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
      } as SignOptions);
    }

    return jwt.sign(payload, JWT_SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
    } as SignOptions);
  };

  // 토큰 검증
  static verify = (token: string, tokenType: TokenType): _JwtPayload => {
    try {
      if (tokenType === TokenType.REFRESH) {
        return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET_KEY, {
          algorithms: ["HS256"],
          maxAge: JWT_REFRESH_TOKEN_EXPIRES_IN,
        }) as _JwtPayload;
      }

      return jwt.verify(token, JWT_SECRET_KEY, {
        algorithms: ["HS256"],
        maxAge: JWT_ACCESS_TOKEN_EXPIRES_IN,
      }) as _JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Unauthorized("토큰이 만료되었습니다. 다시 로그인 해주세요.");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequest("유효하지 않은 토큰입니다.");
      } else if (error instanceof jwt.NotBeforeError) {
        throw new Unauthorized("토큰이 아직 유효하지 않습니다.");
      }

      throw new BadRequest("토큰 검증 중 오류가 발생했습니다.");
    }
  };
}
