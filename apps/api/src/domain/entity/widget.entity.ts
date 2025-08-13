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

export type CreateWidget<T = object> = Omit<Widget<T>, "id" | "createdAt" | "updatedAt" | "deletedAt">;
export type UpdateWidget<T = object> = {
	name?: string;
	value?: T;
	layout?: string;
	updatedBy?: string;
};
