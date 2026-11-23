import type { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { CreateUserDto, ExistDto, SignInDto } from "./dto";
import { ParamIdDto } from "../../common/dto/paramIdDto";

export class AuthController {
  private readonly authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }
  // 닉네임 유효 검증
  existNickname = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ check: boolean }>> => {
    return res.status(StatusCodes.OK).json({
      check: await this.authService.existNickname(
        (await ExistDto(req.body.nickname)).nickname as string,
      ),
    });
  };

  // 이메일 유효 검증
  existEmail = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ check: boolean }>> => {
    return res.status(StatusCodes.OK).json({
      check: await this.authService.existEmail(
        (await ExistDto(req.body.email)).email as string,
      ),
    });
  };

  // 로그인 ID 유효 검증
  existLoginId = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ check: boolean }>> => {
    return res.status(StatusCodes.OK).json({
      check: await this.authService.existLoginId(
        (await ExistDto(req.body.loginId)).loginId as string,
      ),
    });
  };

  // 유저 회원 생성
  create = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string }>> => {
    await this.authService.create(await CreateUserDto(req.body));
    return res.status(StatusCodes.CREATED).json({ message: "회원 생성 완료." });
  };

  // 로그인
  signIn = async (
    req: Request,
    res: Response,
  ): Promise<
    Response<{
      message: string;
      data: { access_token: string; refresh_token: string };
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: "로그인 성공.",
      data: await this.authService.signIn(await SignInDto(req.body)),
    });
  };

  // 로그아웃
  signOut = async (
    req: Request,
    res: Response,
  ): Promise<
    Response<{
      message: string;
    }>
  > => {
    await this.authService.signOut((await ParamIdDto(req.user.id)).id);
    return res.status(StatusCodes.OK).json({
      message: "로그아웃 성공.",
    });
  };
}
