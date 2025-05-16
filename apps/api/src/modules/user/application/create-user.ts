import {db, DbPool} from "@core/db";
import {_trace} from "@core/instrumentation";
import {hashPassword} from "$auth/infra/hash.service";
import {UserInterface} from "$user/domain/interface/user.interface";
import userRepo from "$user/infra/repo/user.repo";

export type CreateUserInput = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

type UserRepo = UserInterface<DbPool>;

export const _createUser = (input: CreateUserInput, repo: UserRepo = userRepo) => {
  return hashPassword({password: input.password})
    .andThen((hashedPassword) =>
      repo.create(db, {email: input.email, password: hashedPassword, firstname: input.firstname, lastname: input.lastname})
    )
}

export default _trace(_createUser, 'app.user/create', {obfuscation: ['password']});