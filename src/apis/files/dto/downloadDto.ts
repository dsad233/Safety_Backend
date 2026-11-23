import { BadRequest } from "http-errors";

export type TDownloadDto = {
  ids: string | string[];
};

export async function DownloadDto(body: {
  ids: string | string[];
}): Promise<NonNullable<TDownloadDto>> {
  if (!body.ids || body.ids.length === 0) {
    throw new BadRequest(
      "선택한 파일 정보가 존재하지 않습니다. 다시 시도해 주세요.",
    );
  }

  return {
    ids: body.ids,
  };
}
