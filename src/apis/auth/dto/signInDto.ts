import { BadRequest } from "http-errors";
import { Regex } from "../../../common/utils";

export type TSignInDto = {
  email?: string | undefined;
  loginId?: string | undefined;
  password: string;
};

export async function SignInDto(
  body: Required<TSignInDto>,
): Promise<NonNullable<TSignInDto>> {
  const { email, loginId, password } = body;

  if (!email && !loginId) {
    throw new BadRequest("이메일 또는 로그인 ID를 입력해주세요.");
  }

  if (!password) {
    throw new BadRequest("패스워드를 입력해주세요.");
  }

  if (!Regex.password.test(password.trim())) {
    throw new BadRequest("유효한 패스워드 형식이 아닙니다.");
  }

  return {
    email: email?.trim(),
    loginId: loginId?.trim(),
    password: password.trim(),
  };
}
