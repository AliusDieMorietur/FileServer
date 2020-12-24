import * as ws from 'ws';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path'
import { threadId } from 'worker_threads';
import { serverConfig } from '../config/server';
import * as formidable from 'formidable'  ;
import { Client } from './client';
import { logger } from './logger';
 

const listener = (req: http.IncomingMessage, res) => {
  if (req.url === '/api/upload' && req.method.toLowerCase() === 'post') {
    const form = formidable({ multiples: true, uploadDir: './storage', keepExtensions: true});
    form.parse(req, (err, fields, files) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ fields, files }, null, 2));
    });
  } else {  
    const client = new Client({ req, res });
    client.static();
  }
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