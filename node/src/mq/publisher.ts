import amqp from 'amqplib';

/**
 * @name publishToQueue
 * @description Publishes a message to a RabbitMQ queue.
 * @param {string} queueName - The name of the RabbitMQ queue.
 * @param {string} message - The message to be published.
 * @returns {Promise<void>}
 */
async function publishToQueue(channel: amqp.Channel, queueName: string, message: string) {
  try {
    await channel.assertQueue(queueName, { durable: true, deadLetterExchange: ``, deadLetterRoutingKey: `${queueName}_fail` });
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`[x] Sent '${message}' to queue '${queueName}'`);
  } catch (error) {
    console.error('Error publishing to queue:', error);
  }
}

export default publishToQueue;
