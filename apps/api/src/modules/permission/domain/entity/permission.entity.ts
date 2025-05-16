export type Permission<T = object> = {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  attributes?: T;
  createdAt: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
}

export type CreatePermission<T = object> = {
  name: string;
  description?: string;
  resource: string;
  action: string;
  attributes?: T;
  createdBy?: string;
}

export type UpdatePermission<T = object> = {
  name?: string;
  description?: string;
  resource?: string;
  action?: string;
  attributes?: T;
  updatedBy?: string;
}