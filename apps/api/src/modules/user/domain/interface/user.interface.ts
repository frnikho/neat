import { Option } from 'fp-ts/Option';
import {ResultAsync} from "neverthrow";
import {DbException} from "@core/exceptions/db.exception";
import {CreateUser, User} from "$user/domain/entity/user.entity";

export type UserInterface<T> = {
  create: (client: T, body: CreateUser) => ResultAsync<User, DbException>;
  findUserById: (client: T, id: string) => ResultAsync<Option<User>, DbException>;
  findUserByEmail: (client: T, email: string) => ResultAsync<Option<User>, DbException>;
}