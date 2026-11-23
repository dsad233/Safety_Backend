import { BadRequest } from "http-errors";

export type TCreateFolderDto = {
  fileName: string;
  path: string;
};

export async function CreateFolderDto(
  body: TCreateFolderDto,
): Promise<NonNullable<TCreateFolderDto>> {
  const { fileName, path } = body;

  if (!fileName) {
    throw new BadRequest("파일명이 존재하지 않습니다. 파일명을 기입해 주세요.");
  }

  if (!path) {
    throw new BadRequest(
      "파일 경로가 존재하지 않습니다. 파일 경로를 기입해 주세요.",
    );
  }

  if (fileName.length > 255) {
    throw new BadRequest("파일명이 올바르지 않습니다. 다시 입력해 주세요.");
  }

  return {
    fileName: fileName.trim(),
    path: path.trim(),
  };
}
