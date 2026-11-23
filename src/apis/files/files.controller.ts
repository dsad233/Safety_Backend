import { FilesService } from "./files.service";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  CreateFolderDto,
  DownloadDto,
  FilterDataDto,
  TFilterDataDto,
  UpdateRenameFileDto,
  UploadFileDto,
} from "./dto";
import { ParamIdDto } from "../../common/dto/paramIdDto";
import { PaginationDto } from "../../common/dto/paginationDto";

export class FilesController {
  private readonly filesService: FilesService;
  constructor(filesService: FilesService) {
    this.filesService = filesService;
  }
  // 폴더 생성
  createFolder = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string }>> => {
    await this.filesService.createFolder(
      (await ParamIdDto(req.user.id)).id,
      await CreateFolderDto(req.body),
    );
    return res.status(StatusCodes.CREATED).json({ message: "폴더 생성 완료." });
  };

  // 파일 업로드
  uploads = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string }>> => {
    await this.filesService.uploads(
      (await ParamIdDto(req.user.id)).id,
      await UploadFileDto(req.body),
    );
    return res.status(StatusCodes.CREATED).json({ message: "업로드 완료." });
  };

  // 선택한 파일들 다운로드
  download = async (
    req: Request,
    res: Response,
  ): Promise<
    Response<{
      message: string;
      data:
        | {
            buffer: string;
          }
        | {
            buffer: string;
          }[];
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: "파일 다운로드 요청 완료.",
      data: await this.filesService.download((await DownloadDto(req.body)).ids),
    });
  };

  // 업로드 된 데이터 조회
  getDatas = async (
    req: Request,
    res: Response,
  ): Promise<
    Response<{
      message: string;
      data: {
        id: string;
        fileName: string;
        extension: string;
        path: string;
        size: number;
        imageType: string;
        updatedAt: Date;
      }[];
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: "파일 목록 조회 완료.",
      data: await this.filesService.getDatas(
        (await ParamIdDto(req.user.id)).id,
        await PaginationDto({
          page: req.query.page as string,
          pages: req.query.pages as string,
        }),
        await FilterDataDto({
          path: req.query.path,
          orderBy: req.query.orderBy,
          filter: req.query.filter,
          search: req.query.search,
        } as TFilterDataDto),
      ),
    });
  };

  // 파일명 수정
  updateRenameFile = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string }>> => {
    await this.filesService.updateRenameFile(
      (await ParamIdDto(req.user.id)).id,
      (await ParamIdDto(req.params.id as string)).id,
      await UpdateRenameFileDto(req.body),
    );
    return res.status(StatusCodes.OK).json({
      message: "파일명 변경 완료.",
    });
  };

  // 파일 삭제
  deleteFile = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string }>> => {
    await this.filesService.deleteFile(
      (await ParamIdDto(req.user.id)).id,
      (await ParamIdDto(req.params.id as string)).id,
    );
    return res.status(StatusCodes.OK).json({
      message: "파일 삭제 완료.",
    });
  };
}
