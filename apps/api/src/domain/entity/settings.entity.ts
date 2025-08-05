export type Settings<T = object> = {
    id: string;
    name: string;
    description?: string;
    isSystem: boolean;
    createdAt: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;
}

export type CreateSettings<T = object> = {
    name: string;
    key: string;
    value: T;
    description?: string;
}

export type UpdateSettings<T = object> = {
    name?: string;
    key?: string;
    value?: T;
    description?: string;
    updatedBy?: string;
}