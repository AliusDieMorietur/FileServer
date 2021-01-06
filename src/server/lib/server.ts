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

    const token = 'zaplatka';
    fs.mkdirSync('./storage/' + token);

    const form = new formidable.IncomingForm(); 

    form.parse(req, (err, fields, files) => {
      if (err) throw err;
      // console.log('fields: ', fields);
      // console.log('files: ', files);
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true, token }, null, 2));
    });

    form.on('fileBegin', (__name, file) => {
      file.path = './storage/' + token + '/' + file.name;
    });

    form.on('file', (__name, file) => {
      console.log('Uploaded ' + file.name);
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