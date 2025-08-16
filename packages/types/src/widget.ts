import {Static, Type} from "@sinclair/typebox";

export const widgetResponse = Type.Object({
    id: Type.String(),
    name: Type.String(),
    key: Type.String(),
    value: Type.Any(),
    layout: Type.String(),
    createdAt: Type.Date(),
    createdBy: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.Date()),
    updatedBy: Type.Optional(Type.String()),
    deletedAt: Type.Optional(Type.Date()),
    deletedBy: Type.Optional(Type.String()),
});

export type WidgetResponse = Static<typeof widgetResponse>;

export const createWidgetRequest = Type.Object({
    name: Type.String(),
    key: Type.String(),
    value: Type.Any(),
    layout: Type.String(),
});

export type CreateWidgetRequest = Static<typeof createWidgetRequest>;

export const updateWidgetRequest = Type.Object({
    name: Type.Optional(Type.String()),
    key: Type.Optional(Type.String()),
    value: Type.Optional(Type.Any()),
    layout: Type.Optional(Type.String()),
});

export type UpdateWidgetRequest = Static<typeof updateWidgetRequest>;

export const widgetModels = {
    'widget.response.get': widgetResponse,
    'widget.response.list': Type.Array(widgetResponse),
    'widget.response.delete': widgetResponse,
    'widget.response.update': widgetResponse,
    'widget.response.create': widgetResponse,
    'widget.request.create': createWidgetRequest,
    'widget.request.update': updateWidgetRequest,
}