export type Role = {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
}

export type CreateRole = {
  name: string;
  description?: string;
  isActive?: boolean;
  createdBy?: string;
}

export type UpdateRole = {
  name?: string;
  description?: string;
  isActive?: boolean;
  updatedBy?: string;
}

export type RoleWithPermissions = Role & {

}