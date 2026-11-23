export type TPaginationDto = {
  page: string | number;
  pages: string | number;
};

export async function PaginationDto(
  query: TPaginationDto,
): Promise<NonNullable<TPaginationDto>> {
  return {
    page: query.page && typeof query.page === "string" ? Number(query.page) : 1,
    pages:
      query.pages && typeof query.pages === "string" ? Number(query.pages) : 10,
  };
}
