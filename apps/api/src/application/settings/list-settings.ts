import type { AuthContext } from '@entity/auth-context.entity';
import type { Pagination } from '@entity/pagination.entity';
import settingsRepo from '@infra/repo/settings.repo';
import { db } from '@service/db.service';

type Input = {
  auth: AuthContext;
  pag: Pagination;
};

export default ({ pag, auth }: Input) => {
  return settingsRepo(db).list(pag.page, pag.limit);
};
