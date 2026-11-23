import { BadRequest } from "http-errors";
import { Regex } from "../../../common/utils";

export type TExistDto = {
  nickname?: string | undefined;
  email?: string | undefined;
  loginId?: string | undefined;
};

export async function ExistDto(
  body: TExistDto,
): Promise<NonNullable<TExistDto>> {
  const { nickname, email, loginId } = body;

  if (email && !Regex.email.test(email.trim())) {
    throw new BadRequest("유효한 이메일 형식이 아닙니다.");
  }

  if (nickname && (nickname.length < 2 || nickname.length >= 30)) {
    throw new BadRequest("닉네임은 2자 이상 30자 미만이어야 합니다.");
  }

  if (email && (email.length < 5 || email.length >= 50)) {
    throw new BadRequest("이메일은 5자 이상 50자 미만이어야 합니다.");
  }

  if (loginId && (loginId.length < 3 || loginId.length >= 20)) {
    throw new BadRequest("로그인 ID는 3자 이상 20자 미만이어야 합니다.");
  }

  return {
    nickname: nickname?.trim(),
    email: email?.trim(),
    loginId: loginId?.trim(),
  };
}
