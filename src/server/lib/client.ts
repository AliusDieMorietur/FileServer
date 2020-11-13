'use strict';

import * as fs from "fs"; 
import * as path from "path"; 
import { logger } from './logger';

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

const STATIC_PATH = process.cwd() + '/target/static/';

const loadFile = async name => {
  const filePath = path.join(STATIC_PATH, name);
  try {
    return await fsp.readFile(filePath);
  } catch (error) {
    logger.error(error);
  }
};

class Client {
  req
  res
  ip
  connection
  constructor(req, res, connection) {
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
    } 
    else {
      this.res.writeHead(404, 'Not Found');
      this.res.end('404: File Not Found!');
    };
  } catch (error) {
    logger.error('static serve error', error);
  }

  async message(data) {
    try {
      const parsed = JSON.parse(data);
    } catch (error) {
      console.error(error);
    }
  }

  send(data) {
    this.connection.send(JSON.stringify(data));
  }
}

export { Client };