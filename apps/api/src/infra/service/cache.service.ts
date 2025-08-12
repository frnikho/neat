import { RedisClient } from 'bun';

export const redisClient = (): RedisClient => {
  return new RedisClient(process.env.REDIS_URL);
};
