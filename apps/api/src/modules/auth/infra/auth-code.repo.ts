import {AuthCodeInterface} from "$auth/domain/auth-code.interface";
import {RedisClient} from "bun";
import {cache} from "@core/cache";
import {fromNullable, isNone, none} from "fp-ts/Option";
import {optionToResult} from "@core/type";
import { Value } from '@sinclair/typebox/value';
import {AuthCode, authCode} from "$auth/domain/auth-code.schema";
import {err, ok, Result} from "neverthrow";
import {CacheException} from "@core/exceptions";
import {createId} from "@paralleldrive/cuid2";
import {traceRepository} from "@core/instrumentation";

export const authCodeRepo: AuthCodeInterface<RedisClient> = {
  getByKey: (client, id) => (
    cache(client.get(id))
      .map(fromNullable)
      .andThen((r) => {
        if (isNone(r)) {
          return ok(none);
        }
        return parseAuthCode(r.value).map(fromNullable);
      })
  ),

  create: (client, body) => {
    const code = createId();
    const authCode: AuthCode = {
      id: createId(),
      code: code,
      created_at: new Date(),
      expires_at: body.expires_at,
    };
    return cache(client.set(code, JSON.stringify(authCode)))
      .map(() => authCode)
  },

  delete: (client, id) => (
    authCodeRepo.getByKey(client, id)
      .andThen((r) => optionToResult(r, new CacheException("Auth code not found")))
      .andThen(_ => cache(client.del(id)))
      .andThen(() => ok())
  )
}

function parseAuthCode(input: unknown): Result<AuthCode, CacheException> {
  if (Value.Check(authCode, JSON.parse(input as string))) { //TODO: check JSON.parse here !
    return ok(input as AuthCode);
  } else {
    return err(new CacheException("Cannot parse auth code", {input}));
  }
}

export default traceRepository(authCodeRepo, {
  create: {
    name: 'repo.auth-code/create',
    config: {
      obfuscation: ['code']
    }
  },
  delete: {
    name: 'repo.auth-code/delete',
  },
  getByKey: {
    name: 'repo.auth-code/getByKey',
  }
})