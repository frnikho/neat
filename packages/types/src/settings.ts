import { type Static, Type } from "@sinclair/typebox";

export * from "./settings/company.settings";

export const settings = Type.Object({
	id: Type.String(),
	name: Type.String({ maxLength: 256 }),
	description: Type.Optional(Type.String({ maxLength: 4096 })),
});

export const settingsKey = Type.Object({
	key: Type.Union([Type.Literal("s3"), Type.Literal("company")]),
});

export const updateSettings = Type.Object({
	name: Type.Optional(Type.String({ maxLength: 256 })),
	description: Type.Optional(Type.String({ maxLength: 4096 })),
});

export const settingsModels = {
	"settings.key": settingsKey,
	"settings.update": updateSettings,
};
