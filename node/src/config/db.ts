require('dotenv').config();
import mongoose from 'mongoose';
import { Client } from 'pg';

const { MONGO_SCHEME, MONGO_HOST, MONGO_PORT, MONGO_USER, MONGO_PASSWORD, MONGO_DB } = process.env;

/**
 * @name mongoose
 * @description Establishes a connection to MongoDB using environment variables.
 */
mongoose.connect(
  MONGO_USER && MONGO_PASSWORD ? `${MONGO_SCHEME}://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}` : `${MONGO_SCHEME}://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`,
);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;


/**
 * @name pgClient
 * @description Establishes a connection to PostgreSQL using environment variables.
 */
const pgClient = new Client({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
});

pgClient.connect();

export { mongoose, pgClient };
