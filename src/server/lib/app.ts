import * as fs from 'fs';
import { promises as fsp } from 'fs';
import * as path from 'path';
import { logger } from './logger';

const STATIC_PATH = path.join(process.cwd(), './static');

export class App {
  logger = logger;
  static = new Map();

  getStatic(filePath: string): Buffer {
    return this.static.get(filePath);
  }

  async loadFile(filePath: string, storage: Map<String, Buffer>) {
    try {
      const file = await fsp.readFile(filePath);
      storage.set(filePath.slice(STATIC_PATH.length), file);
    } catch (error) {
      this.logger.error(error);
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
    } catch (error) {
      this.logger.error(error);
    }
  }

  async start() {
    await this.loadDirectory(STATIC_PATH);
  }
}
