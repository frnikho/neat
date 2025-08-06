export type Settings<T> = {
    id: string;
    name: string;
    description?: string;
    key: string;
    value: T;
    isSystem: boolean;
    createdAt: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;
}

export type CreateSettings<T> = {
    name: string;
    key: string;
    value: T;
    description?: string;
}

export type UpdateSettings<T> = {
    name?: string;
    key?: string;
    value?: T;
    description?: string;
    updatedBy?: string;
}