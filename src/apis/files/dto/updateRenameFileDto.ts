import { BadRequest } from "http-errors";

export type TUpdateRenameFileDto = {
  fileName: string;
};

export async function UpdateRenameFileDto(
  body: TUpdateRenameFileDto,
): Promise<NonNullable<TUpdateRenameFileDto>> {
  const { fileName } = body;

  if (!fileName) {
    throw new BadRequest("파일명이 존재하지 않습니다. 파일명을 기입해 주세요.");
  }

  if (fileName.length > 255) {
    throw new BadRequest("파일명이 올바르지 않습니다. 다시 입력해 주세요.");
  }

  return {
    fileName: fileName.trim(),
  };
}
