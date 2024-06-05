import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

/**
 * @name connectRabbitMQ
 * @description Connects to RabbitMQ and initializes the channel.
 * @returns {Promise<void>}
 */
export async function connectRabbitMQ(): Promise<amqp.Channel> {
  console.log('Connecting to RabbitMQ');
  
  const { RABBIT_SCHEMA, RABBIT_USER, RABBIT_PASSWORD, RABBIT_HOST, RABBIT_PORT } = process.env;

  try {
    connection = await amqp.connect(`${RABBIT_SCHEMA}://${RABBIT_USER}:${RABBIT_PASSWORD}@${RABBIT_HOST}:${RABBIT_PORT}` || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
}
/**
 * @name closeRabbitMQ
 * @description Closes the RabbitMQ connection and channel.
 * @returns {Promise<void>}
 */
export async function closeRabbitMQ(): Promise<void> {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
    console.log('Closed RabbitMQ connection');
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error);
  }
}
