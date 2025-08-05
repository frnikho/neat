import { Option } from 'fp-ts/Option';
import {ResultAsync} from "neverthrow";
import {CreateUser, UpdateUser, User} from "@entity/user.entity";

export type UserInterface = {
  create: (body: CreateUser) => ResultAsync<User, DbException>;
  list: (page: number, limit: number) => ResultAsync<User[], DbException>;
  findUserById: (id: string) => ResultAsync<Option<User>, DbException>;
  findUserByEmail: (email: string) => ResultAsync<Option<User>, DbException>;
  deletes: (ids: string[]) => ResultAsync<User[], DbException>;
  softDeletes: (ids: string[], deletedBy?: string) => ResultAsync<User[], DbException>;
  update: (id: string, body: UpdateUser) => ResultAsync<User, DbException>;
}