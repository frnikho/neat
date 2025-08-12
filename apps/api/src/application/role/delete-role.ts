import type { AuthContext } from '@entity/auth-context.entity';
import type { Role } from '@entity/role.entity';
import roleRepo from '@infra/repo/role.repo';
import { db } from '@infra/service/db.service';
import type { ResultAsync } from 'neverthrow';

type Input = {
  auth: AuthContext;
  roleId: string;
};

type Output = {
  role: Role;
};

export default ({ roleId, auth }: Input): ResultAsync<Output, Error> => {
  return roleRepo(db)
    .softDelete(roleId, auth.user.id)
    .map((role) => ({
      role,
    }));
};
