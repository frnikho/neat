import {Static, Type} from "@sinclair/typebox";

export const pageResponse = Type.Object({
    id: Type.String(),
    name: Type.String(),
    description: Type.String(),
    slug: Type.String(),
    createdAt: Type.String(Type.Date()),
    createdBy: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.Date()),
    updatedBy: Type.Optional(Type.String()),
    deletedAt: Type.Optional(Type.Date()),
    deletedBy: Type.Optional(Type.String()),
});

export type PageResponse = Static<typeof pageResponse>;

export const createPageRequest = Type.Object({
    name: Type.String(),
    description: Type.String(),
    slug: Type.String(),
});

export type CreatePageRequest = Static<typeof createPageRequest>;

export const updatePageRequest = Type.Object({
    name: Type.String(),
    description: Type.String(),
    slug: Type.String(),
});

export type UpdatePageRequest = Static<typeof updatePageRequest>;

export const pageModels = {
    'page.response.get': pageResponse,
    'page.response.list': Type.Array(pageResponse),
    'page.response.delete': pageResponse,
    'page.response.update': pageResponse,
    'page.response.create': pageResponse,
    'page.request.create': createPageRequest,
    'page.request.update': updatePageRequest,
}