import {Layout} from "@entity/layout.entity";

export type Page = {
	id: string;
	name: string;
    description: string;
    slug: string;
	createdAt: Date;
	createdBy?: string;
	updatedAt?: Date;
	updatedBy?: string;
	deletedAt?: Date;
	deletedBy?: string;
};

export type CreatePage = {
    name: string;
    description: string;
    slug: string;
    createdBy?: string;
};

export type UpdatePage = {
    name?: string;
    description?: string;
    slug?: string;
    updatedBy?: string;
};

export type PageWithLayouts = {
    page: Page;
    layouts: Layout[];
}

export type PageCache = {
    page: Page;
    layouts: Layout[];
};