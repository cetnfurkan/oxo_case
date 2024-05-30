import { createClient } from 'redis';
require('dotenv').config();

const {
  REDIS_HOST, REDIS_USER, REDIS_PASSWORD, REDIS_PORT, REDIS_SCHEME,
} = process.env;

/**
 * @name redisClient
 * @description Creates and configures a Redis client using environment variables.
 */
const redisClient = createClient({
  url: `${REDIS_SCHEME}://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
  username: REDIS_USER,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect().catch(console.error);

export default redisClient;
