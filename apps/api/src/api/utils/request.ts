import type { Pagination } from "@entity/pagination.entity";
import { type Static, t } from "elysia";

export const defaultPagination: Pagination = {
	page: 0,
	limit: 50,
};

const pagination = t.Object({
	page: t.Optional(t.Number({ minimum: 0, maximum: 2000 })),
	limit: t.Optional(t.Number({ minimum: 0, maximum: 200 })),
});

export type PaginationQuery = Static<typeof pagination>;

export const Id = t.String({ minLength: 12, maxLength: 12 });

export const extractFromQuery = (query: PaginationQuery): Pagination => {
	const page = query.page ?? defaultPagination.page;
	const limit = query.limit ?? defaultPagination.limit;

	return {
		page,
		limit,
	};
};

export const authCookie = t.Cookie(
	{
		access_token: t.String(),
		refresh_token: t.String(),
	},
	{ secure: true, httpOnly: true },
);

export type AuthCookie = Static<typeof authCookie>;

export const requestModels = {
	pagination,
	"auth.cookie": authCookie,
};
