import { BadRequest } from "http-errors";
import { Regex } from "../../../common/utils";

export type TCreateUserDto = {
  nickname: string;
  email: string;
  loginId: string;
  password: string;
};

export async function CreateUserDto(
  body: Required<{
    nickname: string;
    email: string;
    loginId: string;
    password: string;
    confirmPassword: string;
  }>,
): Promise<NonNullable<TCreateUserDto>> {
  const { nickname, email, loginId, password, confirmPassword } = body;

  if (!nickname) {
    throw new BadRequest("닉네임을 입력해주세요.");
  }

  if (!email) {
    throw new BadRequest("이메일을 입력해주세요.");
  }

  if (!loginId) {
    throw new BadRequest("로그인 ID를 입력해주세요.");
  }

  if (!password) {
    throw new BadRequest("패스워드를 입력해주세요.");
  }

  if (!confirmPassword) {
    throw new BadRequest("확인 패스워드를 입력해주세요.");
  }

  if (password !== confirmPassword) {
    throw new BadRequest("패스워드와 확인 패스워드가 일치하지 않습니다.");
  }

  if (!Regex.email.test(email.trim())) {
    throw new BadRequest("유효한 이메일 형식이 아닙니다.");
  }

  if (!Regex.password.test(password.trim())) {
    throw new BadRequest("유효한 패스워드 형식이 아닙니다.");
  }

  if (nickname.length < 2 || nickname.length >= 30) {
    throw new BadRequest("닉네임은 2자 이상 30자 미만이어야 합니다.");
  }

  if (email.length < 5 || email.length >= 50) {
    throw new BadRequest("이메일은 5자 이상 50자 미만이어야 합니다.");
  }

  if (loginId.length < 3 || loginId.length >= 20) {
    throw new BadRequest("로그인 ID는 3자 이상 20자 미만이어야 합니다.");
  }

  if (password.length < 8 || password.length >= 30) {
    throw new BadRequest("패스워드는 8자 이상 30자 미만이어야 합니다.");
  }

  return {
    nickname: nickname.trim(),
    email: email.trim(),
    loginId: loginId.trim(),
    password: password.trim(),
  };
}
