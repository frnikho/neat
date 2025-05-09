import {ResultAsync} from "neverthrow";
import {AppException} from "@core/exceptions";
import {Option} from "fp-ts/Option";

type Value = string | Bun.ArrayBufferView | Blob;

export type TokenInterface<T> = {
  insert: (client: T, key: string, value: Value) => ResultAsync<void, AppException>;
  get: (client: T, key: string) => ResultAsync<Option<string>, AppException>;
  delete: (client: T, key: string) => ResultAsync<void, AppException>;
  deleteAll: (client: T, key: string) => ResultAsync<void, AppException>;
}

export type TokenServiceInterface = {
  createTokenPair: (sessionId: string, userId: string) => ResultAsync<{accessToken: string, refreshToken: string}, AppException>;
  rotateTokens: (sessionId: string, userId: string) => ResultAsync<{accessToken: string, refreshToken: string, userId: string}, AppException>;
  invalidateSession: (userId: string, sessionId: string) => ResultAsync<void, AppException>;
  invalidateAllSessions: (userId: string) => ResultAsync<void, AppException>;
}