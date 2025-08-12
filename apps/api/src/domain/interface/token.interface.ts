import type { CacheException } from '@infra/exception/cache.exception';
import type { Option } from 'fp-ts/Option';
import type { ResultAsync } from 'neverthrow';

type Value = string | Bun.ArrayBufferView | Blob;

export type TokenInterface = {
  insert: (
    key: string,
    value: Value,
    expiration?: number
  ) => ResultAsync<void, CacheException>;
  get: (key: string) => ResultAsync<Option<string>, CacheException>;
  delete: (key: string) => ResultAsync<void, CacheException>;
  deleteAll: (key: string) => ResultAsync<void, CacheException>;
};

export type TokenServiceInterface = {
  createTokenPair: (
    sessionId: string,
    userId: string
  ) => ResultAsync<
    { accessToken: string; refreshToken: string },
    CacheException
  >;
  rotateTokens: (
    sessionId: string,
    userId: string
  ) => ResultAsync<
    { accessToken: string; refreshToken: string; userId: string },
    CacheException
  >;
  invalidateSession: (
    userId: string,
    sessionId: string
  ) => ResultAsync<void, CacheException>;
  invalidateAllSessions: (userId: string) => ResultAsync<void, CacheException>;
};
