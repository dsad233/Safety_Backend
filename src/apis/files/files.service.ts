import type { TPaginationDto } from "../../common/dto/paginationDto";
import { formatDate } from "../../common/utils";
import type {
  TCreateFolderDto,
  TFilterDataDto,
  TUpdateRenameFileDto,
  TUploadFileDto,
} from "./dto";
import { FilesRepository } from "./files.repository";
import { BadRequest, NotFound } from "http-errors";

export class FilesService {
  private readonly filesRepository: FilesRepository;
  constructor(filesRepository: FilesRepository) {
    this.filesRepository = filesRepository;
  }

  // 폴더 생성
  createFolder = async (
    userId: string,
    body: TCreateFolderDto,
  ): Promise<void> => {
    await this.filesRepository.createFolder(userId, body);
  };

  // 파일 업로드
  uploads = async (userId: string, body: TUploadFileDto): Promise<void> => {
    const buffer = Buffer.from(body.file, "base64");

    // 버퍼 사이즈가 4GB를 넘으면 패스 처리
    if (buffer.byteLength > 4294967295) {
      throw new BadRequest(
        "용량이 너무 큽니다. 다른 파일로 다시 시도해 주세요.",
      );
    }

    // 디비에 파일 저장
    await this.filesRepository.uploads(userId, body);
  };

  // 선택한 파일들 다운로드
  download = async (
    ids: string | string[],
  ): Promise<
    | {
        buffer: string;
      }
    | {
        buffer: string;
      }[]
  > => {
    // 파일이 여러개 조회되어야 할 때는 getFiles를 사용
    if (ids.length > 1 && Array.isArray(ids)) {
      const files = await this.filesRepository.getFiles(ids as string[]);

      if (!files) {
        throw new NotFound("해당 파일 목록들이 존재하지 않습니다.");
      }

      return files;
    }

    const file = await this.filesRepository.getFile(ids as string);

    if (!file) {
      throw new NotFound("해당 파일 목록이 존재하지 않습니다.");
    }

    return {
      buffer: file.buffer,
    };
  };

  // 업로드 된 데이터 조회
  getDatas = async (
    userId: string,
    pagination: TPaginationDto,
    query: TFilterDataDto,
  ): Promise<
    {
      id: string;
      fileName: string;
      extension: string;
      path: string;
      size: number;
      imageType: string;
      updatedAt: string;
      folderInfo?:
        | {
            length: number | undefined;
            totalSize: number | undefined;
          }
        | undefined;
    }[]
  > => {
    const files = await this.filesRepository.getDatas(
      userId,
      pagination,
      query,
    );

    // console.log("files: ", files);

    return await Promise.all(
      files.map(async (file) => {
        if (file.extension === ".folder") {
          const folderInfo = await this.filesRepository.getFolderInfos(
            file.fileName,
            query.path,
          );

          return {
            id: file.id,
            fileName: file.fileName,
            extension: file.extension,
            path: file.path,
            size: file.size ? Number(file.size) : 0,
            imageType: file.imageType,
            updatedAt: formatDate(file.updatedAt),
            folderInfo: {
              length: folderInfo?.count,
              totalSize: Number(folderInfo?.totalSize),
            },
          };
        }

        return {
          id: file.id,
          fileName: file.fileName,
          extension: file.extension,
          path: file.path,
          size: file.size ? Number(file.size) : 0,
          imageType: file.imageType,
          updatedAt: formatDate(file.updatedAt),
        };
      }),
    );
  };

  // 파일명 수정
  updateRenameFile = async (
    userId: string,
    id: string,
    body: TUpdateRenameFileDto,
  ): Promise<void> => {
    await this.filesRepository.updateRenameFile(userId, id, body);
  };

  // 파일 삭제
  deleteFile = async (userId: string, id: string): Promise<void> => {
    await this.filesRepository.deleteFile(userId, id);
  };
}
