import { andThrow } from '@infra/utils/type.utils';
import type { ResultAsync } from 'neverthrow';

export const response = <T, Z = T>(
  res: ResultAsync<T, Error>,
  handler?: (data: T) => Z
) => {
  return res.match((data) => {
    return handler ? handler(data) : (data as unknown as Z);
  }, andThrow);
};
