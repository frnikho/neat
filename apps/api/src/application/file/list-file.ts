import type { AuthContext } from '@entity/auth-context.entity';
import type { Pagination } from '@entity/pagination.entity';
import { fileMetadataRepo } from '@repo/file.repo';
import { db } from '@service/db.service';

type Input = {
  auth: AuthContext;
  pag: Pagination;
};

export default ({ auth, pag }: Input) => {
  return fileMetadataRepo(db).list(pag.page, pag.limit);
};
