import getS3Settings from '@application/settings/get-s3-settings';
import type { AuthContext } from '@entity/auth-context.entity';
import { fileMetadataRepo, fileObjectRepo } from '@repo/file.repo';
import { db } from '@service/db.service';
import { s3Client } from '@service/file.service';

type Input = {
  id: string;
  auth: AuthContext;
};

export default ({ id }: Input) => {
  return fileMetadataRepo(db).findById(id);
};
