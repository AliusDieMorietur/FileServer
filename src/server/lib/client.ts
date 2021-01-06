import * as fs from "fs"; 
import * as path from "path"; 
import * as ws from 'ws';
import { IncomingMessage } from 'http';
import { logger } from './logger';

type ClientArgs = { req: IncomingMessage, res?, connection?: ws };

const fsp = fs.promises;

const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ALPHA = ALPHA_UPPER + ALPHA_LOWER;

const MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  ico: 'image/ico',
  json: 'application/json',
  svg: 'image/svg+xml',
};

const STATIC_PATH = process.cwd() + '/static/';

const loadFile = async (name: string) => {
  const filePath = path.join(STATIC_PATH, name);
  try {
    return await fsp.readFile(filePath);
  } catch (error) {
    logger.error(error);
  }
};

export class Client {
  private req
  private res
  private ip
  private connection
  private token

  constructor({ req, res, connection }: ClientArgs ) {
    this.req = req;
    this.res = res;
    this.ip = req.socket.remoteAddress;
    this.connection = connection;
  }

  static() {
    const url = this.req.url === '/' ? '/index.html' : this.req.url;
    const fileExt = path.extname(url).substring(1);

    if (MIME_TYPES[fileExt]) {
      this.res.writeHead(200, { 'Content-Type': MIME_TYPES[fileExt] });
      loadFile(url).then(data => {
        this.res.end(data);
      })
      .catch(logger.error);
    } else {
      this.res.writeHead(404, 'Not Found');
      this.res.end('404: File Not Found!');
    };
  }

  async message(data) {
    try {
      fs.writeFile("123", Buffer.from(data).toString(), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
      //TODO parse data correctly
    } catch (error) {
      console.error(error);
    }
  }

  send(data) {
    //TODO send data correctly
    this.connection.send(data);
  }
}