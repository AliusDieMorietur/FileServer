import * as ws from 'ws';
import * as http from 'http';
import { threadId } from 'worker_threads';
import { serverConfig } from '../config/server';
import { Client } from './client';
import { logger } from './logger';
 
const listener = (req: http.IncomingMessage, res) => {
  const client = new Client({ req, res });
  client.static();
};

export class Server {
  instance = http.createServer(listener);
  ws = new ws.Server({ server: this.instance });

  constructor() {
    const { ports } = serverConfig; 
    const port = ports[threadId - 1];
    this.ws.on('connection', (connection, req) => {
      const client = new Client({ connection, req });
      connection.on('message', (data) => {
        client.message(data);
      })
    });

    this.instance.listen(port, () => {
      logger.log(`Listen port ${port}`);
    })
  }
  
  async close() {
    //TODO graceful shutdown
    logger.log('close');
  }
}