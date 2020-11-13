import * as vm from 'vm';
import * as fs from 'fs';
import * as worker_threads from 'worker_threads';
import { Server } from './server';

const server = new Server();

worker_threads.parentPort.on('message', async message => {
  if (message.name === 'stop') {
    process.exit(0);
  }
});


