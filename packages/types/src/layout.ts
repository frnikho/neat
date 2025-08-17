import {Static, Type} from "@sinclair/typebox";
import {IsoDate} from "./date";

export const layoutResponse = Type.Object({
    id: Type.String(),
    name: Type.String(),
    key: Type.String(),
    page: Type.String(),
    createdAt: IsoDate,
    createdBy: Type.Optional(Type.String()),
    updatedAt: Type.Optional(IsoDate),
    updatedBy: Type.Optional(Type.String()),
    deletedAt: Type.Optional(IsoDate),
    deletedBy: Type.Optional(Type.String()),
});

export type LayoutResponse = Static<typeof layoutResponse>;

export const createLayoutRequest = Type.Object({
    name: Type.String(),
    key: Type.String(),
    page: Type.String(),
});

export type CreateLayoutRequest = Static<typeof createLayoutRequest>;

export const updateLayoutRequest = Type.Object({
    name: Type.Optional(Type.String()),
    key: Type.Optional(Type.String()),
    page: Type.Optional(Type.String()),
});

export type UpdateLayoutRequest = Static<typeof updateLayoutRequest>;

export const layoutModels = {
    'layout.response.get': layoutResponse,
    'layout.response.list': Type.Array(layoutResponse),
    'layout.response.delete': layoutResponse,
    'layout.response.update': layoutResponse,
    'layout.response.create': layoutResponse,
    'layout.request.create': createLayoutRequest,
    'layout.request.update': updateLayoutRequest,
}