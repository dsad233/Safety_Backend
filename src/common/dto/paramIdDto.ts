import { BadRequest } from "http-errors";

export type TParamIdDto = {
  id: string;
};

export async function ParamIdDto(
  id: string,
): Promise<NonNullable<TParamIdDto>> {
  if (!id) {
    throw new BadRequest("파라미터 ID가 누락되었습니다. 다시 시도해 주세요.");
  }

  return {
    id: id,
  };
}
