import { dir } from 'console';
import * as fs from 'fs';
import { promises as fsp } from 'fs';
import * as path from 'path';
import { logger } from './logger';

const STATIC_PATH = path.join(process.cwd(), './static');
const STORAGE_PATH = path.join(process.cwd(), './storage/');

const toUnix = filePath => 
  process.platform === 'win32' 
    ? filePath
      .split(path.sep)
      .join(path.posix.sep)
    : filePath;

export class App {
  logger = logger;
  static = new Map();

  getStatic(filePath: string): Buffer {
    return this.static.get(filePath);
  }

  async getInfo(token) {
    const info = await fsp.readFile(path.join(STORAGE_PATH, token + '_info.json'));
    return JSON.parse(info.toString()).savedNames;
  }

  async folderTimeout(folderPath, time) {
    setTimeout(async () => {
      await fsp.unlink(folderPath + '_info.json');
      await fsp.rmdir(folderPath, { recursive: true });
    }, time);
  }

  async clearExpired() {
    try {
      let count = 0;
      const list = await fsp.readdir(STORAGE_PATH, { withFileTypes: true });
      for (const item of list) {
        if (item.isFile()) {
          const filePath = path.join(STORAGE_PATH, item.name);
          const dirPath = filePath.replace('_info.json','');
          const buffer = await fsp.readFile(filePath);
          const expired = JSON.parse(buffer.toString()).expire < Date.now();
          if (expired) {
            await fsp.unlink(filePath);
            await fsp.rmdir(dirPath, { recursive: true });
            this.logger.success(`${path.parse(dirPath).base} files deleted`);
            count++;
          }
        }
      }
      this.logger.log(`Tokens expired: ${count}`);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async loadFile(filePath: string, storage: Map<String, Buffer>) {
    try {
      const file = await fsp.readFile(filePath);
      storage.set(
        toUnix(filePath.slice(STATIC_PATH.length)),
        file
      );
    } catch (err) {
      this.logger.error(err);
    }
  }

  async loadDirectory(dirPath: string) {
    try {
      const files = await fsp.readdir(dirPath, { withFileTypes: true });
      for (const file of files) {
        if (file.name.startsWith('.')) continue;
        const filePath = path.join(dirPath, file.name);
        if (file.isDirectory()) await this.loadDirectory(filePath);
        else await this.loadFile(filePath, this.static);
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  async start() {
    await this.loadDirectory(STATIC_PATH);
    this.logger.success('Static Loaded');
  }
}
