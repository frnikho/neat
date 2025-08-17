import {Static, Type} from "@sinclair/typebox";
import {layoutResponse} from "./layout";
import {widgetResponse} from "./widget";
import {IsoDate} from "./date";

export const pageResponse = Type.Object({
    id: Type.String(),
    name: Type.String(),
    description: Type.String(),
    slug: Type.String(),
    createdAt: IsoDate,
    createdBy: Type.Optional(Type.String()),
    updatedAt: Type.Optional(IsoDate),
    updatedBy: Type.Optional(Type.String()),
    deletedAt: Type.Optional(IsoDate),
    deletedBy: Type.Optional(Type.String()),
});

const layout = Type.Object({
    layout: layoutResponse,
    widgets: Type.Array(widgetResponse),
});

export const pageContentResponse = Type.Object({
    id: Type.String(),
    name: Type.String(),
    description: Type.String(),
    slug: Type.String(),
    createdAt: IsoDate,
    layouts: Type.Array(layout)
})

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

export const listPageResponse = Type.Object({
    pages: Type.Array(pageResponse),
    total: Type.Integer(),
})

export type UpdatePageRequest = Static<typeof updatePageRequest>;

export const pageModels = {
    'page.response.get': pageContentResponse,
    'page.response.list': listPageResponse,
    'page.response.delete': pageResponse,
    'page.response.update': pageResponse,
    'page.response.create': pageResponse,
    'page.request.create': createPageRequest,
    'page.request.update': updatePageRequest,
}