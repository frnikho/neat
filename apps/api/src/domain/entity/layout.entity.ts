export type Layout = {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;
}