import {db} from "@core/db";
import {_trace} from "@core/instrumentation";
import {hashPassword} from "$auth/infra/hash.service";
import {UserInterface} from "$user/domain/interface/user.interface";
import userRepo from "$user/infra/repo/user.repo";

export type Input = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}


export const _createUser = (input: Input, repo: UserInterface = userRepo(db)) => {
  return hashPassword({password: input.password})
    .andThen((hashedPassword) =>
      repo.create({email: input.email, password: hashedPassword, firstname: input.firstname, lastname: input.lastname})
    )
}

export default _trace(_createUser, 'app.user/create', {obfuscation: ['password']});