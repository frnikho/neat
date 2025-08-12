import type { AuthContext } from '@entity/auth-context.entity';
import { ok } from 'neverthrow';

type Input = {
  auth: AuthContext;
};

export default (input: Input) => {
  /*verifyToken(input.token, false).andThen(({payload}) => {
      payload.
    })*/
  return ok({});
};
