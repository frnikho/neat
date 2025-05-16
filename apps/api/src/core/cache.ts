import { ResultAsync } from "neverthrow";
import { CacheException } from "@core/exceptions";
import { RedisClient } from "bun";

export const cache = <T> (a: Promise<T>): ResultAsync<T, CacheException> => {
  return ResultAsync.fromPromise(a, (err) => {
    console.log('cache');
    console.log(err);
    return new CacheException("Redis error");
  });
}


export const redisClient = (): RedisClient => {
  return new RedisClient(process.env.REDIS_URL);
};