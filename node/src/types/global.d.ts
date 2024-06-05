import { RedisClientType } from 'redis';

declare global {
  namespace NodeJS {
    interface GlobalVariables {
      redisClient: RedisClientType;
    }
  }
}
