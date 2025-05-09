import {AuthCodeInterface} from "$auth/domain/auth-code.interface";
import {RedisClient} from "bun";
import {redisClient} from "@core/cache";
import {createId} from "@paralleldrive/cuid2";

export const createAuthCode = (deps: {repo: AuthCodeInterface<RedisClient>})=> () => {
  return deps.repo.create(redisClient(), {code: createId()}).map((r) => {
    return r;
  })
}
