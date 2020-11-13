import { parentPort } from 'worker_threads';
import { Server } from './server';

const server = new Server();

parentPort.on('message', async message => {
  if (message.name === 'stop') {
    server.close();
    process.exit(0);
  }
});


