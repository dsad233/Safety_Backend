import { BadRequest } from "http-errors";
import { FilterType, OrderByType } from "../../../common/libs/types";

export type TFilterDataDto = {
  path: string;
  orderBy: OrderByType;
  filter: FilterType | undefined;
  search?: string | undefined;
};

export async function FilterDataDto(
  query: TFilterDataDto,
): Promise<NonNullable<TFilterDataDto>> {
  const { path, orderBy, filter, search } = query;

  if (!path) {
    throw new BadRequest(
      "파일 경로가 존재하지 않습니다. 파일 경로를 기입해 주세요.",
    );
  }

  if (!orderBy) {
    throw new BadRequest("정렬값이 존재하지 않습니다. 다시 시도해 주세요.");
  }

  if (!filter) {
    throw new BadRequest("필터값이 존재하지 않습니다. 다시 시도해 주세요.");
  }

  return {
    path: path.trim(),
    orderBy: orderBy,
    filter: filter !== "all" ? filter : undefined,
    search: search?.trim(),
  };
}
