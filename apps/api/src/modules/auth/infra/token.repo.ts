import {TokenInterface} from "$auth/domain/token.interface";
import {RedisClient} from "bun";
import {cache} from "@core/cache";
import {err, ok} from "neverthrow";
import {none, some} from "fp-ts/Option";
import {traceRepository} from "@core/instrumentation";

const EXPIRATION_TIME = 60 * 60 * 24 * 7; // 7 days

const tokenRepo: TokenInterface<RedisClient> = {

  insert(client, key, value) {
    return cache(client.set(key, value, "EX", EXPIRATION_TIME))
      .andThen(() => ok())
  },

  get(client, key) {
    return cache(client.get(key))
      .andThen((r) => {
        if (r === null) {
          return ok(none);
        }
        return ok(some(r));
      })
  },

  delete(client, key) {
    return cache(client.del(key))
      .andThen(() => ok())
  },

  deleteAll(client, key) {
    return cache(client.keys(key))
      .andThen((keys) => {
        if (keys.length === 0) {
          return ok();
        }
        return ok(cache(Promise.all(keys.map((key) => client.del(key)))))
      })
      .andThen(() => ok())
  },
}

export default traceRepository(tokenRepo, {
  insert: {
    name: 'repo.token/insert',
  },
  get: {
    name: 'repo.token/get',
  },
  delete: {
    name: 'repo.token.delete',
  },
  deleteAll: {
    name: 'repo.token/deleteAll',
  }
});