import http from 'http';
import app from './app';
import { Server } from 'socket.io';
import cron from 'node-cron';
import config = require('./config/config');
import { connectRedis } from './config/redis';
import { connectRabbitMQ } from './config/rabbitmq';
import { connectMongoDB, connectPostgres } from './config/db';
import cors from 'cors';
import publishToQueue from './mq/publisher';
import consumeQueue from './mq/consumer';
import processMessage from './utils/messageProcessor';
import Apk from './models/Apk';

const port = process.env.PORT || 3010;
const server = http.createServer(app);
const io = new Server(server);

/**
 * @name io.on('connection')
 * @description Handles a new WebSocket connection.
 * @param {Socket} socket - The socket object representing the client connection.
 */
io.on('connection', (socket) => {
  console.log('a user connected');
});

/**
 * @name notifyClients
 * @description Sends APK update notifications to all connected WebSocket clients.
 * @param {Apk[]} apkDetails - The details of the updated APK.
 */
export function notifyClients(apkDetails: Apk[]) {
  io.emit('apkUpdate', apkDetails);
}

app.use(cors({
  origin: 'http://localhost:3000'
}));

/**
 * @name main
 * @description Initializes necessary connections and starts the server.
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  try {

    // Redis bağlantısını başlat
    const redisClient = await connectRedis();
    
    // RabbitMQ bağlantısını başlat
    const channel = await connectRabbitMQ();

    // MongoDB ve PostgreSQL bağlantılarını başlat
    await connectMongoDB();
    await connectPostgres();

    // Sunucuyu başlat
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      redisClient.set('serverStatus', 'running');
    });

    // // RabbitMQ kuyruklarını tüket
    consumeQueue(channel, 'apkQueue', '', 'apkQueue_fail', (channel, msg) => processMessage(redisClient, channel, msg, false, notifyClients));
    consumeQueue(channel, 'apkQueue_fail_retry', '', undefined, (channel, msg) => {
      publishToQueue(channel, 'apkQueue', msg!.content?.toString());
      channel.ack(msg!);
    });

    cron.schedule('*/2 * * * *', async () => {
      const tasks = config.default.map(({ org, repo }) =>
        (async () => {
          await publishToQueue(channel, 'apkQueue', JSON.stringify({ org, repo }));
        })()
      );
      await Promise.all(tasks);
    });
  } catch (error) {
    console.error('Failed to initialize the server:', error);
    process.exit(1); // Hata durumunda uygulamayı sonlandır
  }
}

// main fonksiyonunu çağır
main();
