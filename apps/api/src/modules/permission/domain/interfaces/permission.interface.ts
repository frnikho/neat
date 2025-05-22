import { ResultAsync } from "neverthrow";
import { Option } from "fp-ts/Option";
import { CreatePermission, Permission, UpdatePermission } from "../entity/permission.entity";
import { DbException } from "@core/exceptions";

type Result<T> = ResultAsync<T, DbException>;

export type PermissionInterface = {
  findById: (id: string) => Result<Option<Permission>>;
  findByIds: (ids: string[]) => Result<Permission[]>;
  findByApiName: (name: string) => Result<Option<Permission>>;
  list: (page: number, limit: number) => Result<Permission[]>;
  create: (body: CreatePermission) => Result<Permission>;
  update: (id: string, body: UpdatePermission) => Result<Permission>;
  delete: (id: string) => Result<void>;
  softDelete: (id: string, deletedBy?: string) => Result<void>;
}