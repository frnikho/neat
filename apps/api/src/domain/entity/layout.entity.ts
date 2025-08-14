import {Widget} from "@entity/widget.entity";

export type Layout = {
	id: string;
	name: string;
    key: string;
    page: string;
	createdAt: Date;
	createdBy?: string;
	updatedAt?: Date;
	updatedBy?: string;
	deletedAt?: Date;
	deletedBy?: string;
};

export type CreateLayout = {
    name: string;
    key: string;
    page: string;
    createdBy?: string;
};

export type UpdateLayout = {
    name?: string;
    key?: string;
    page?: string;
    updatedBy?: string;
};

export type LayoutWithWidgets = {
    layout: Layout;
    widgets: Widget[];
}

export type LayoutCache = {
    layout: Layout;
    widgets: Widget[];
}