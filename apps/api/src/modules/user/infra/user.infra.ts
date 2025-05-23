import {InferSelectModel} from "drizzle-orm";
import {user} from "$user/infra/schema/user.schema";
import {User} from "$user/domain/entity/user.entity";
import {isNone, none, Option, some} from "fp-ts/Option";

type UserDb = InferSelectModel<typeof user>;

export const mapUser = (row: UserDb): User => {
  return {
    id: row.id,
    email: row.email,
    firstname: row.firstname,
    lastname: row.lastname,
    password: row.password,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt ?? undefined,
    createdBy: row.createdBy ?? undefined,
    updatedBy: row.updatedBy ?? undefined,
    deletedAt: row.deletedAt ?? undefined,
    deletedBy: row.deletedBy ?? undefined
  }
}

export const mapUserOption = (row: Option<UserDb>): Option<User> => {
  if (isNone(row)) {
    return none
  }
  return some(mapUser(row.value))
}

export const mapUsers = (rows: UserDb[]): User[] => {
  return rows.map(mapUser);
}