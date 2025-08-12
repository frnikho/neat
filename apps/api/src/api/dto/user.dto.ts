import * as Elysia from 'elysia';
import { t } from 'elysia';

export const userProfilePicture = t.Object({
  file: Elysia.t.File({ type: ['image/png', 'image/jpeg'], maxSize: '8m' }),
  filename: t.String(),
});

export const UserRequestDTO = {
  'user.request.profile-picture': userProfilePicture,
};
