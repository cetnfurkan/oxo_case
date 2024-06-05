import saveApkDetails from '../services/apkService';
import sendToFailQueue from '../mq/deadLetterPublisher';
import { Channel, ConsumeMessage } from 'amqplib';
import Apk from '../models/Apk';
import { RedisClientType } from 'redis';

/**
 * @name processMessage
 * @description Processes a message from a RabbitMQ queue.
 * @param {Channel} channel - The RabbitMQ channel.
 * @param {ConsumeMessage | null} msg - The message to be processed.
 * @param {boolean} isFailQueue - Indicates if the message is from a fail queue.
 * @returns {Promise<void>}
 */
async function processMessage(redisClient: RedisClientType, channel: Channel, msg: ConsumeMessage | null, isFailQueue: boolean, notifyClients: (apkDetails: Apk[]) => void): Promise<void> {
    if (msg) {
        try {
            const { org, repo } = JSON.parse(msg.content.toString());
            const apkDetails = await saveApkDetails(redisClient, org, repo);

            // Notify clients via WebSocket
            notifyClients(apkDetails);

            // Acknowledge the message
            channel.ack(msg);
        } catch (error) {
            console.error('Error processing message:', error);
            if (!isFailQueue) {
                await sendToFailQueue(channel, 'apkQueue', msg);
            }
        }
    } else {
        console.error('Received null message');
    }
}

export default processMessage;
