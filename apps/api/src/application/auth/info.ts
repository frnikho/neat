import type { PublicUser, User } from '@entity/user.entity';
import { okAsync, type ResultAsync } from 'neverthrow';
import {RoleWithPermissions} from "@entity/role.entity";
import {db} from "@service/db.service";
import userRoleRepo from "@repo/user-role.repo";
import {user} from "@schema/user.schema";

type Input = {
  loggedUser: User;
  accessToken: string;
};

type Output = {
    user: PublicUser;
    roles: RoleWithPermissions[];
};

export default (input: Input): ResultAsync<Output, Error> => {
  const { loggedUser } = input;

  return userRoleRepo(db).findRoleAndPermissions(loggedUser.id).map((roles) => ({
      user: loggedUser,
      roles,
  }))

};
