import * as ws from 'ws';
import * as fs from 'fs'
import * as path from 'path';
import { generateToken } from './auth';
import { Loader } from './loader';
const fsp = fs.promises;

const STORAGE_PATH = path.join(process.cwd(), './storage/');

export class Channel {
  private application;
  private connection;
  private token: string;
  private loader;

  constructor(connection: ws, application) {
    this.connection = connection;
    this.application = application;
    this.loader = new Loader(connection, STORAGE_PATH, this.application.logger);
  }

  async message(data) {
    this.loader.message(data);
  }

  send(data) {
    try {
      this.connection.send(data);
    } catch (err) {
      this.application.logger.error(err);
    }
  }
}