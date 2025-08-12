import userRepo from '@infra/repo/user.repo';
import { db } from '@infra/service/db.service';
import { hashPassword } from '@infra/service/hash.service';
import type { UserInterface } from '@interface/user.interface';

export type Input = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

export default (input: Input, repo: UserInterface = userRepo(db)) => {
  return hashPassword({ password: input.password }).andThen((hashedPassword) =>
    repo.create({
      email: input.email,
      password: hashedPassword,
      firstname: input.firstname,
      lastname: input.lastname,
    })
  );
};
