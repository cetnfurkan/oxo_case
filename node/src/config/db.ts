require('dotenv').config();
import mongoose from 'mongoose';
import { Client } from 'pg';

const { MONGO_SCHEME, MONGO_HOST, MONGO_PORT, MONGO_USER, MONGO_PASSWORD, MONGO_DB } = process.env;

/**
 * @name connectMongoDB
 * @description Establishes a connection to MongoDB using environment variables.
 * @returns {Promise<void>}
 */
async function connectMongoDB(): Promise<void> {
  const mongoUri = MONGO_USER && MONGO_PASSWORD
    ? `${MONGO_SCHEME}://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`
    : `${MONGO_SCHEME}://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

  return new Promise((resolve, reject) => {
    mongoose.connect(mongoUri);
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
      resolve();
    });
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      reject(err);
    });
  });
}

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

/**
 * @name connectPostgres
 * @description Establishes a connection to PostgreSQL using environment variables.
 * @returns {Promise<Client>}
 */
async function connectPostgres(): Promise<Client> {
  const pgClient = new Client({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
  });

  return new Promise((resolve, reject) => {
    pgClient.connect(err => {
      if (err) {
        console.error('PostgreSQL connection error:', err);
        reject(err);
      } else {
        console.log('PostgreSQL connected');
        (global as any).pgClient = pgClient; // Global değişkene kaydet
        resolve(pgClient);
      }
    });
  });
}

export { connectMongoDB, connectPostgres };
