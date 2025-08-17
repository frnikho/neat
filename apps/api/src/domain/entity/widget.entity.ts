export type Widget<T = object> = {
	id: string;
	name: string;
    key: string;
	value: T;
    layout: string;
	createdAt: Date;
	createdBy?: string;
	updatedAt?: Date;
	updatedBy?: string;
	deletedAt?: Date;
	deletedBy?: string;
};

export type CreateWidget<T = object> = {
    name: string;
    key: string;
    value: T;
    layout: string;
    createdBy?: string;
};

export type UpdateWidget<T = object> = {
	name?: string;
    key?: string;
	value?: T;
    layout?: string;
	updatedBy?: string;
};

export type ListWidgets<T = object> = {
    widgets: Widget<T>[];
    total: number;
}