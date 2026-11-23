import { MySql2Database } from "drizzle-orm/mysql2";
import { users } from "../../../schema/schema";
import type { TCreateUserDto } from "./dto/createUserDto";
import { hashPassword } from "../../common/utils";
import { eq } from "drizzle-orm";

export class AuthRepository {
  private db: MySql2Database;
  constructor(db: MySql2Database) {
    this.db = db;
  }

  // 닉네임 유효 검증
  existNickname = async (
    nickname: string,
  ): ReturnType<(nickname: string) => Promise<boolean>> => {
    const [existNickname] = await this.db
      .select({ nickname: users.nickname })
      .from(users)
      .where(eq(users.nickname, nickname));

    return existNickname ? true : false;
  };

  // 이메일 유효 검증
  existEmail = async (
    email: string,
  ): ReturnType<(email: string) => Promise<boolean>> => {
    const [existEmail] = await this.db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, email));

    return existEmail ? true : false;
  };

  // 로그인 ID 유효 검증
  existLoginId = async (
    loginId: string,
  ): ReturnType<(loginId: string) => Promise<boolean>> => {
    const [existLoginId] = await this.db
      .select({
        loginId: users.loginId,
      })
      .from(users)
      .where(eq(users.loginId, loginId));

    return existLoginId ? true : false;
  };

  // 유저 회원 생성
  create = async (
    body: TCreateUserDto,
  ): ReturnType<(body: TCreateUserDto) => Promise<void>> => {
    await this.db.insert(users).values({
      nickname: body.nickname,
      email: body.email,
      loginId: body.loginId,
      password: await hashPassword(body.password),
    });
  };

  // 기존 이메일 사용자 조회
  findByEmailUser = async (
    email: string,
  ): ReturnType<
    (email: string) => Promise<
      | {
          id: string;
          nickname: string;
          email: string;
          password: string;
        }
      | undefined
    >
  > => {
    const [user] = await this.db
      .select({
        id: users.id,
        nickname: users.nickname,
        email: users.email,
        password: users.password,
      })
      .from(users)
      .where(eq(users.email, email));

    return user;
  };

  // 기존 로그인 ID 사용자 조회
  findByLoginIdUser = async (
    loginId: string,
  ): ReturnType<
    (
      loginId: string,
    ) => Promise<
      | { id: string; nickname: string; loginId: string; password: string }
      | undefined
    >
  > => {
    const [user] = await this.db
      .select({
        id: users.id,
        nickname: users.nickname,
        loginId: users.loginId,
        password: users.password,
      })
      .from(users)
      .where(eq(users.loginId, loginId));

    return user;
  };
}
