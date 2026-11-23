import { Request, Response } from "express";
import { UsersService } from "./users.service";
import { ParamIdDto } from "../../common/dto/paramIdDto";
import { StatusCodes } from "http-status-codes";

export class UsersController {
  private readonly usersService: UsersService;
  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  // 마이 페이지 조회
  myPage = async (
    req: Request,
    res: Response,
  ): Promise<
    Response<{
      message: string;
      data: {
        nickname: string;
        email: string;
        loginId: string;
      };
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: "마이 페이지 조회 성공.",
      data: await this.usersService.myPage((await ParamIdDto(req.user.id)).id),
    });
  };
}
