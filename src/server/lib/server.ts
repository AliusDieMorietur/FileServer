import * as ws from 'ws';
import * as http from 'http';
import * as worker_threads from 'worker_threads';
import { serverConfig } from '../config/server';
import { Client } from './client';
import { logger } from './logger';
 
const listener = (req, res) => {
  const client = new Client(req, res, null);
  client.static();
};

class Server {
  instance
  ws
  constructor() {
    const { ports } = serverConfig; 
    const { threadId } = worker_threads;
    const port: number = ports[threadId - 1];
    this.instance = http.createServer(listener);
    this.ws = new ws.Server({ server: this.instance });
    this.ws.on('connection', (connection, req) => {
      const client = new Client(req, null, connection);
      connection.on('message', (data) => {
        client.message(data);
      })
    });

    this.instance.listen(port, () => {
      logger.log(`Listen port ${port}`);
    })
  }
  
  async close() {
    logger.log('close');
  }
}

export { Server };