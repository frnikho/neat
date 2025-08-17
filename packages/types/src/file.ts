import { Type } from "@sinclair/typebox";
import {IsoDate} from "./date";

export const fileResponse = Type.Object({
	id: Type.String(),
	name: Type.String(),
	size: Type.Number(),
	type: Type.String(),
	url: Type.String(),
	createdAt: IsoDate,
	createdBy: Type.Optional(Type.String()),
	updatedAt: Type.Optional(IsoDate),
	updatedBy: Type.Optional(Type.String()),
});

export const fileModels = {
	"file.response.get": fileResponse,
	"file.response.list": Type.Array(fileResponse),
	"file.response.delete": fileResponse,
};
