import { Static, Type } from "@sinclair/typebox";

export const companySettings = Type.Object({
	title: Type.String({
		description: "The title of the company or application",
	}),
	description: Type.String({
		description: "A brief description of the company or application",
	}),
	logoUrl: Type.String({
		description: "URL to the company logo",
	}),
	version: Type.String({
		description: "Current version of the application",
	}),
	slogan: Type.String({
		description: "Current slogan name of the application",
	}),
});

export type CompanySettings = Static<typeof companySettings>;
