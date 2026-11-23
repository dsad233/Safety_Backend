import { MySql2Database } from "drizzle-orm/mysql2";
import { users } from "../../../schema/schema";
import { eq } from "drizzle-orm";

export class UsersRepository {
  private db: MySql2Database;
  constructor(db: MySql2Database) {
    this.db = db;
  }

  // 마이 페이지 조회
  myPage = async (
    id: string,
  ): ReturnType<
    (id: string) => Promise<
      | {
          nickname: string;
          email: string;
          loginId: string;
        }
      | undefined
    >
  > => {
    const [user] = await this.db
      .select({
        nickname: users.nickname,
        email: users.email,
        loginId: users.loginId,
      })
      .from(users)
      .where(eq(users.id, id));
    return user;
  };
}
