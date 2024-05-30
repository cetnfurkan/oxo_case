import http from 'http';
import app from './app';
import saveApkDetails from './services/apkService';
import { Server } from 'socket.io';
import cron from 'node-cron';
import config = require('./config/config');
import redisClient from './config/redis';
import cors from 'cors';

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
 * @param {any} apkDetails - The details of the updated APK.
 */
function notifyClients(apkDetails: any) {
  io.emit('apkUpdate', apkDetails);
}

app.use(cors({
  origin: 'http://localhost:3000'
}));

/**
 * @name server.listen
 * @description Starts the HTTP server and sets the server status in Redis.
 * @param {number} port - The port on which the server will listen.
 */
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  redisClient.set('serverStatus', 'running');
});

/**
 * @name cron.schedule
 * @description Schedules a task to fetch and save APK details every 2 minutes.
 */
cron.schedule('*/2 * * * *', async () => {
  const tasks = config.default.map(({ org, repo }) => 
    (async () => {
      const apkDetails = await saveApkDetails(org, repo);
      notifyClients(apkDetails);
    })()
  );
  
  await Promise.all(tasks);
});
