import { Channel, ConsumeMessage } from 'amqplib';

/**
 * @name sendToFailQueue
 * @description Sends a message to the fail queue (dead-letter queue).
 * @param {string} queueName - The name of the original queue.
 * @param {ConsumeMessage} msg - The message to be sent to the fail queue.
 * @returns {Promise<void>}
 */
async function sendToFailQueue(channel: Channel, queueName: string, msg: ConsumeMessage): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Sending message to fail queue...');
      
      const failQ = `${queueName}_fail`;
      await channel.assertQueue(failQ, {
        deadLetterRoutingKey: `${queueName}_fail_retry`,
        deadLetterExchange: ``
      });
      channel.sendToQueue(failQ, msg.content, { expiration: 10000 });
      channel.ack(msg);
      resolve();
    } catch (error) {
      channel.reject(msg, true);
      console.error('Send to fail queue error', error);
      reject(error);
    }
  });
}

export default sendToFailQueue;
