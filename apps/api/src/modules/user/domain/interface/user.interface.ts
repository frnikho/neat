import { Option } from 'fp-ts/Option';
import {ResultAsync} from "neverthrow";
import {DbException} from "@core/exceptions/db.exception";
import {CreateUser, UpdateUser, User} from "$user/domain/entity/user.entity";

export type UserInterface = {
  create: (body: CreateUser) => ResultAsync<User, DbException>;
  list: (page: number, limit: number) => ResultAsync<User[], DbException>;
  findUserById: (id: string) => ResultAsync<Option<User>, DbException>;
  findUserByEmail: (email: string) => ResultAsync<Option<User>, DbException>;
  /*findUsers: () => ResultAsync<User[], DbException>;*/
  deletes: (ids: string[]) => ResultAsync<User[], DbException>;
  softDeletes: (ids: string[], deletedBy?: string) => ResultAsync<User[], DbException>;
  update: (id: string, body: UpdateUser) => ResultAsync<User, DbException>;
}