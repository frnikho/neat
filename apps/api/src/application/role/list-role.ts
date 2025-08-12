import type { AuthContext } from '@entity/auth-context.entity';
import type { Pagination } from '@entity/pagination.entity';
import type { Role } from '@entity/role.entity';
import roleRepo from '@infra/repo/role.repo';
import { db } from '@infra/service/db.service';
import type { ResultAsync } from 'neverthrow';

type Input = {
  auth: AuthContext;
  pag: Pagination;
};

type Output = Role[];

export default ({ pag }: Input): ResultAsync<Output, Error> => {
  return roleRepo(db).list(pag.page, pag.limit);
};
