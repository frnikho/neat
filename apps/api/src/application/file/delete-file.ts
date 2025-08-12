import { apiErrorCodeToStatus } from '@api/api.exception';
import { type AppException, appException } from '@application/app.exception';
import type { AuthContext } from '@entity/auth-context.entity';
import { oneOrThrow, optionToResult } from '@infra/utils/type.utils';
import type { Bucket } from '@interface/file.interface';
import { fileMetadataRepo, fileObjectRepo } from '@repo/file.repo';
import { db } from '@service/db.service';
import { s3Client } from '@service/file.service';
import { err, errAsync, okAsync, type ResultAsync } from 'neverthrow';

type Input = {
  id: string;
  auth: AuthContext;
};

export default ({ id }: Input) => {
  return fileMetadataRepo(db)
    .findById(id)
    .andThen((r) =>
      optionToResult(
        r,
        appException(apiErrorCodeToStatus.BAD_REQUEST, 'File not found')
      )
    )
    .andThen((file) =>
      mapBucketName(file.bucket).andThen((bucket) =>
        fileObjectRepo(s3Client()).delete(file.key, bucket)
      )
    );
};

const mapBucketName = (bucket: string): ResultAsync<Bucket, AppException> => {
  switch (bucket) {
    case 'user':
      return okAsync('user');
    default:
      return errAsync(
        appException(apiErrorCodeToStatus.BAD_REQUEST, 'Invalid bucket name')
      );
  }
};
