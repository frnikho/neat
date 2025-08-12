import { apiErrorCodeToStatus } from '@api/api.exception';
import { appException } from '@application/app.exception';
import type { AuthContext } from '@entity/auth-context.entity';
import type { User } from '@entity/user.entity';
import userRepo from '@infra/repo/user.repo';
import { db } from '@infra/service/db.service';
import { buildPublicUrl } from '@infra/service/file.service';
import { hasAnyPermission } from '@infra/service/permission.service';
import { optionToResult } from '@infra/utils/type.utils';
import { isNone } from 'fp-ts/Option';
import { errAsync, okAsync, type ResultAsync } from 'neverthrow';

type Input = {
  auth: AuthContext;
  userId: string;
};

type Output = {
  user: User;
  profilePicture?: string;
};

export default (
  { userId, auth }: Input,
  repo = userRepo(db)
): ResultAsync<Output, Error> => {
  if (!canGetUser(auth, userId)) {
    return errAsync(
      appException(
        apiErrorCodeToStatus.FORBIDDEN,
        "You don't have permission to get users"
      )
    );
  }

  return repo
    .findUserByIdWithProfilePicture(userId)
    .andThen((user) =>
      optionToResult(
        user,
        appException(
          apiErrorCodeToStatus.NOT_FOUND,
          `User with id ${userId} not found`
        )
      )
    )
    .andThen(([user, profilePicture]) => {
      if (isNone(profilePicture)) {
        return okAsync({ user, url: undefined });
      }
      return buildPublicUrl(db, profilePicture.value, 'user').map((url) => ({
        user,
        url,
      }));
    })
    .map(
      ({ user, url }): Output => ({
        user,
        profilePicture: url,
      })
    );
};

const canGetUser = ({ user, roles }: AuthContext, userId: string): boolean => {
  const isSelf = user.id === userId;
  const hasAll = hasAnyPermission(roles, ['user.read.all', 'user.*']);
  const hasOwn = hasAnyPermission(roles, ['user.read.own', 'user.*']);
  return (isSelf && hasOwn) || (!isSelf && hasAll);
};
