export type Pagination = {
  page: number;
  limit: number;
}

export const defaultPagination: Pagination = {
  page: 1,
  limit: 10,
}

export const extractFromQuery = (params: Record<string, string>): Pagination => {
  const page = parseInt(params.page) || defaultPagination.page;
  const limit = parseInt(params.limit) || defaultPagination.limit;

  return {
    page,
    limit,
  }
}