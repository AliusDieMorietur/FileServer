import * as fs from "fs";
import * as path from "path";
import * as ws from 'ws';
import { IncomingMessage } from 'http';
import { logger } from './logger';
import { generateToken } from './auth';
import { listStorage } from "./storage";

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

const arrayBufferToString = buffer => {
  return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

const stringToArrayBuffer = s => {
  const buf = new ArrayBuffer(s.length);
  let bufView = new Uint8Array(buf);
  for (let i = 0, strLen = s.length; i < strLen; i++) {
    bufView[i] = s.charCodeAt(i);
  }
  return buf;
};

export class Client {
  private req
  private res
  private ip
  private connection
  private incomingCount: number
  private token: string

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
      if (typeof data == 'string') {
        const jsonData = JSON.parse(data);

        if (typeof jsonData === 'number') {
          this.incomingCount = jsonData;
          this.token = generateToken();
          fs.mkdirSync('./storage/' + this.token);
          this.send(this.token);

        } else if (typeof jsonData === 'object') {
          if (jsonData.length === 1) {
            // let link; и тип мы генерим тут между ними линки на файлы
            // this.send(JSON.stringify({ list: listStorage(jsonData[0]), link }))
            this.send(JSON.stringify(listStorage(jsonData[0])))
          } else {
            this.send(fs.readFileSync(`./storage/${jsonData[0]}/${jsonData[1]}`));
          }
        }
      }
      else if (this.incomingCount > 0) {
        const bufferView = new Uint8Array(data);
        let nameBufferLen = 0;
        let name = '';

        for (let i = 0; i < bufferView.byteLength; i++) {
          if (bufferView[i] === 0) break;
          nameBufferLen++;
          name += String.fromCharCode(bufferView[i]);
        }

        const dataBuffer = new Uint8Array(bufferView.byteLength - nameBufferLen - 1);

        for (let i = nameBufferLen + 1; i < bufferView.byteLength; i++) {
          dataBuffer[i - nameBufferLen - 1] = bufferView[i];
        }

        fs.writeFile(`./storage/${this.token}/${name}`, dataBuffer, (err) => {
          if (err) throw err;
        });

        this.incomingCount--;
      }
    } catch (error) {
      console.error(error);
    }
  }

  send(data) {
    //TODO send data correctly
    this.connection.send(data);
  }
}