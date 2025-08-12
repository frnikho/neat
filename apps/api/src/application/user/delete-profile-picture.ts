import { apiErrorCodeToStatus } from '@api/api.exception';
import { appException } from '@application/app.exception';
import type { AuthContext } from '@entity/auth-context.entity';
import { fileMetadataRepo, fileObjectRepo } from '@infra/repo/file.repo';
import userRepo from '@infra/repo/user.repo';
import { db } from '@infra/service/db.service';
import { s3Client } from '@infra/service/file.service';
import { optionToResult } from '@infra/utils/type.utils';
import { errAsync } from 'neverthrow';

type Input = {
  auth: AuthContext;
  userId: string;
};

export default ({ auth, userId }: Input) => {
  return userRepo(db)
    .findUserById(userId)
    .andThen((user) =>
      optionToResult(
        user,
        appException(apiErrorCodeToStatus['BAD_REQUEST'], 'User not found')
      )
    )
    .andThen((user) => {
      console.log(user);
      if (!user.profilePictureFile) {
        return errAsync(
          appException(400, 'User does not have a profile picture')
        );
      }
      const pictureFile = user.profilePictureFile;
      return fileMetadataRepo(db)
        .findById(pictureFile)
        .andThen((f) =>
          optionToResult(
            f,
            appException(
              apiErrorCodeToStatus['BAD_REQUEST'],
              'Profile picture file not found'
            )
          )
        )
        .andThen((f) => fileObjectRepo(s3Client()).delete(f.key, 'user'))
        .andThen(() => fileMetadataRepo(db).delete(pictureFile))
        .andThen(() => userRepo(db).deleteProfilePicture(userId, auth.user.id));
    });
};
