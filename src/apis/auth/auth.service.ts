import {
  JWT_ACCESS_TOKEN_EXPIRES_TTL,
  JWT_REFRESH_TOKEN_EXPIRES_TTL,
} from "../../common/configs/keys";
import { PrefixType, TokenType } from "../../common/libs/types";
import { JwtService } from "../../common/modules/jwt.service";
import { RedisService } from "../../common/modules/redis.service";
import { comparePassword, Regex } from "../../common/utils";
import { AuthRepository } from "./auth.repository";
import type { TCreateUserDto, TSignInDto } from "./dto";
import { BadRequest, NotFound } from "http-errors";

export class AuthService {
  private readonly authRepository: AuthRepository;
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  // 닉네임 유효 검증
  existNickname = async (nickname: string): Promise<boolean> => {
    return await this.authRepository.existNickname(nickname);
  };

  // 이메일 유효 검증
  existEmail = async (email: string): Promise<boolean> => {
    return await this.authRepository.existEmail(email);
  };

  // 로그인 ID 유효 검증
  existLoginId = async (loginId: string): Promise<boolean> => {
    return await this.authRepository.existLoginId(loginId);
  };

  // 유저 회원 생성
  create = async (body: TCreateUserDto): Promise<void> => {
    await this.authRepository.create(body);
  };

  // 로그인
  signIn = async (
    body: TSignInDto,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> => {
    if (body.email && Regex.email.test(body.email)) {
      const user = await this.authRepository.findByEmailUser(body.email);

      if (!user) {
        throw new NotFound("유저를 찾을 수 없습니다.");
      }

      if (!(await comparePassword(body.password, user.password))) {
        throw new BadRequest(
          "비밀번호가 일치하지 않습니다. 다시 시도해 주세요.",
        );
      }

      const session = {
        nickname: user.nickname,
        email: user.email,
      };

      const accessToken = JwtService.sign(session, TokenType.ACCESS);
      const refreshToken = JwtService.sign(session, TokenType.REFRESH);

      await RedisService.setex(
        `${PrefixType.SESSION}:${TokenType.ACCESS}:userId=${user.id}`,
        JWT_ACCESS_TOKEN_EXPIRES_TTL,
        accessToken,
      );
      await RedisService.setex(
        `${PrefixType.SESSION}:${TokenType.REFRESH}:userId=${user.id}`,
        JWT_REFRESH_TOKEN_EXPIRES_TTL,
        refreshToken,
      );

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }

    const user = await this.authRepository.findByLoginIdUser(
      body.loginId as string,
    );

    if (!user) {
      throw new NotFound("유저를 찾을 수 없습니다.");
    }

    if (!(await comparePassword(body.password, user.password))) {
      throw new BadRequest("비밀번호가 일치하지 않습니다. 다시 시도해 주세요.");
    }

    const session = {
      nickname: user.nickname,
      loginId: user.loginId,
    };

    const accessToken = JwtService.sign(session, TokenType.ACCESS);
    const refreshToken = JwtService.sign(session, TokenType.REFRESH);

    await RedisService.setex(
      `${PrefixType.SESSION}:${TokenType.ACCESS}:userId=${user.id}`,
      JWT_ACCESS_TOKEN_EXPIRES_TTL,
      accessToken,
    );
    await RedisService.setex(
      `${PrefixType.SESSION}:${TokenType.REFRESH}:userId=${user.id}`,
      JWT_REFRESH_TOKEN_EXPIRES_TTL,
      refreshToken,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  };

  // 로그아웃
  signOut = async (id: string): ReturnType<(id: string) => Promise<void>> => {
    await RedisService.remove(
      `${PrefixType.SESSION}:${TokenType.ACCESS}:userId=${id}`,
    );
    await RedisService.remove(
      `${PrefixType.SESSION}:${TokenType.REFRESH}:userId=${id}`,
    );
  };
}
