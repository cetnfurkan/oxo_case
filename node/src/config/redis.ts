import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const {
  REDIS_HOST, REDIS_USER, REDIS_PASSWORD, REDIS_PORT, REDIS_SCHEME,
} = process.env;

/**
 * @name createRedisClient
 * @description Creates and configures a Redis client using environment variables.
 * @returns {RedisClientType}
 */
function createRedisClient(): RedisClientType {
  return createClient({
    url: `${REDIS_SCHEME}://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
    username: REDIS_USER,
  });
}

/**
 * @name connectRedis
 * @description Connects to Redis and handles connection events.
 * @returns {Promise<RedisClientType>}
 */
async function connectRedis(): Promise<RedisClientType> {
  const redisClient = createRedisClient();

  return new Promise<RedisClientType>((resolve, reject) => {
    redisClient.on('connect', () => {
      console.log('Connected to Redis');
      resolve(redisClient);
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
      reject(err);
    });

    redisClient.connect().catch((err) => {
      console.error('Error connecting to Redis:', err);
      reject(err);
    });

    (global as any).redisClient = redisClient;
  });
}

export { connectRedis };
