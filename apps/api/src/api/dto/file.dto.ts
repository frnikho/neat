import {t} from 'elysia';

export const fileResponse = t.Object({
    id: t.String(),
    name: t.String(),
    size: t.Number(),
    type: t.String(),
    url: t.String(),
    createdAt: t.Date(),
    createdBy: t.Optional(t.String()),
    updatedAt: t.Optional(t.Date()),
    updatedBy: t.Optional(t.String()),
});

export const fileModels = {
    'file.response.get': fileResponse,
    'file.response.list': t.Array(fileResponse),
    'file.response.delete': fileResponse,
}