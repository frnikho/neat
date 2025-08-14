export type Widget<T = object> = {
	id: string;
	name: string;
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
    value: T;
    layout: string;
    createdBy?: string;
};

export type UpdateWidget<T = object> = {
	name?: string;
	value?: T;
    layout?: string;
	updatedBy?: string;
};
