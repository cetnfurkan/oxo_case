import {Channel, ConsumeMessage} from 'amqplib';

/**
 * @name consumeQueue
 * @description Consumes messages from a RabbitMQ queue and processes them using a callback function.
 * @param {string} queueName - The name of the RabbitMQ queue.
 * @param {(ch: Channel, msg: ConsumeMessage | null) => void} callback - The callback function to process messages.
 * @returns {Promise<void>}
 */
async function consumeQueue(channel: Channel, queueName: string, exchange: string | undefined, routingKey: string | undefined, callback: (ch: Channel, msg: ConsumeMessage | null) => void): Promise<void> {
    try {
        await channel.assertQueue(queueName, { durable: true, deadLetterExchange: exchange, deadLetterRoutingKey: routingKey });
        channel.consume(queueName, (msg) => {
            callback(channel, msg);
        });
    } catch (error) {
        console.error('Error consuming from queue:', error);
        throw error;
    }
}

export default consumeQueue;
