import {Static, t} from "elysia";

export type Pagination = {
  page: number;
  limit: number;
}

export const defaultPagination: Pagination = {
  page: 1,
  limit: 10,
}


const pagination = t.Object({
  page: t.Optional(t.Number({minimum: 1, maximum: 200})),
  limit: t.Optional(t.Number({minimum: 1, maximum: 200})),
});

export type PaginationQuery = Static<typeof pagination>;

export const Id = t.String({minLength: 12, maxLength: 12});

export const extractFromQuery = (query: PaginationQuery): Pagination => {
  const page = query.page ?? defaultPagination.page;
  const limit = query.limit ?? defaultPagination.limit;

  return {
    page,
    limit,
  }
}

export const RequestModels = {
  'pagination': pagination,
}