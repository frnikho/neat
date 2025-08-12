import { type Static, Type } from '@sinclair/typebox';

export const fileResponse = Type.Object({
  id: Type.String(),
  name: Type.String(),
  size: Type.Number(),
  type: Type.String(),
  url: Type.String(),
  createdAt: Type.Date(),
  createdBy: Type.Optional(Type.String()),
  updatedAt: Type.Optional(Type.Date()),
  updatedBy: Type.Optional(Type.String()),
});

export const fileModels = {
  'file.response.get': fileResponse,
  'file.response.list': Type.Array(fileResponse),
  'file.response.delete': fileResponse,
};
