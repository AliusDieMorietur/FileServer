import * as path from 'path';
import { promises as fsp } from 'fs';
import { generateToken } from './auth';
import { serverConfig } from '../config/server';

const STORAGE_PATH: string = path.join(process.cwd(), './storage/');
const TOKEN_LIFE_TIME: number = serverConfig.tokenLifeTime;

export class Channel {
  private application;
  private connection;
  private token: string;
  private buffers: Buffer[] = [];
  private actions: object;

  constructor(connection, application) {
    this.connection = connection;
    this.application = application;
    this.actions = {
      'upload': async (call: number, args) => {
        const { list } = args;
        this.token = generateToken();
        const dirPath = path.join(STORAGE_PATH, this.token);
        await fsp.mkdir(dirPath);
        
        const savedNames = {};
        const expire = Date.now() + TOKEN_LIFE_TIME;
        for (const fileName of list) savedNames[fileName] = generateToken();
        const infoPath = path.join(STORAGE_PATH, this.token + '_info.json');
        await fsp.writeFile(infoPath, JSON.stringify({ expire, savedNames }));
        
        if (this.buffers.length !== list.length) {
          let err = 'Buffers or it`s names corrupted';
          this.application.logger.error(err);
          this.send(JSON.stringify({ callId: call, error: { message: err } }));
          return;
        }
    
        for (let i = 0; i < list.length; i++) {
          const generatedNames: string[] = Object.values(savedNames);
          const fileName = path.join(STORAGE_PATH, this.token, generatedNames[i]);
          const buffer = this.buffers[i];
          await fsp.writeFile(fileName, buffer);
        }
        
        this.application.folderTimeout(path.join(STORAGE_PATH, this.token), TOKEN_LIFE_TIME);
        this.buffers = [];
        this.send(JSON.stringify({ callId: call, result: this.token }));
      },
      'available-files': async (call: number, args) => {
        const { token } = args;
        try {
          const info = await this.application.getInfo(token);
          const list = Object.keys(info);
          this.send(JSON.stringify({ callId: call, result: list }));
        } catch (err) {
          this.application.logger.error(err);
          if (err.code === 'ENOENT') 
            this.send(JSON.stringify({ callId: call, error: { message: 'No such token' } }));
        }
      },
      'download': async (call, args) => {
        const { files, token } = args;
        let list = await this.application.getInfo(token);
        for (const file of files) {
          const buffer = await fsp.readFile(path.join(STORAGE_PATH, token, list[file]));
          this.send(buffer);
        }
        this.send(JSON.stringify({ callId: call, result: files }));
      }
    };
    
  }

  async message(data) {
    try {
      if (typeof data === 'string') {
        const packet = JSON.parse(data);
        const { call, msg, args } = packet;
        if (this.actions[msg]) this.actions[msg](call, args);
      } else {
        this.buffers.push(data);
      };
    } catch (err) {
      this.application.logger.error(err);
    }
  }

  send(data) {
    try {
      this.connection.send(data);
    } catch (err) {
      this.application.logger.error(err);
    }
  }
}