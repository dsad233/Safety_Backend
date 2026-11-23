import { BadRequest } from "http-errors";
import { ImageType } from "../../../common/libs/types";

export type TUploadFileDto = {
  fileName: string;
  extension: string;
  path: string;
  file: string;
  imageType: ImageType;
};

export async function UploadFileDto(
  body: TUploadFileDto,
): Promise<NonNullable<TUploadFileDto>> {
  const { fileName, extension, path, file, imageType } = body;

  if (!fileName) {
    throw new BadRequest("파일명이 존재하지 않습니다. 파일명을 기입해 주세요.");
  }

  if (!extension) {
    throw new BadRequest(
      "파일 확장자가 존재하지 않습니다. 파일 확장자를 기입해 주세요.",
    );
  }

  if (!path) {
    throw new BadRequest(
      "파일 경로가 존재하지 않습니다. 파일 경로를 기입해 주세요.",
    );
  }

  if (!file) {
    throw new BadRequest("파일이 존재하지 않습니다. 파일을 추가해 주세요.");
  }

  if (!imageType) {
    throw new BadRequest(
      "이미지 타입이 존재하지 않습니다. 이미지 타입을 기입해 주세요.",
    );
  }

  if (fileName.length > 255) {
    throw new BadRequest("파일명이 올바르지 않습니다. 다시 입력해 주세요.");
  }

  if (extension.length > 10) {
    throw new BadRequest(
      "파일 확장자가 올바르지 않습니다. 다시 입력해 주세요.",
    );
  }

  if (path.length > 100) {
    throw new BadRequest("파일 경로가 올바르지 않습니다. 다시 입력해 주세요.");
  }

  if (!Object.keys(ImageType).toString().includes(imageType)) {
    throw new BadRequest(
      "이미지 타입이 올바르지 않습니다. 다시 입력해 주세요.",
    );
  }

  return {
    fileName: fileName.trim(),
    extension: extension.trim(),
    path: path.trim(),
    file: file,
    imageType: imageType,
  };
}
