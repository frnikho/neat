import {AuthCode, CreateAuthCode} from "$auth/domain/auth-code.schema";
import {ResultAsync} from "neverthrow";
import {AppException} from "@core/exceptions";
import {Option} from "fp-ts/Option";

export type AuthCodeInterface<T> = {
  create: (client: T, body: CreateAuthCode) => ResultAsync<AuthCode, AppException>;
  getByKey: (client: T, id: string) => ResultAsync<Option<AuthCode>, AppException>;
  delete: (client: T, id: string) => ResultAsync<void, AppException>;
}