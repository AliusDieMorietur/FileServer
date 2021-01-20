import * as fs from 'fs';
import { promises as fsp } from 'fs';
import * as path from 'path';
import { logger } from './logger';

class App {
  logger = logger;
  static = new Map();
  constructor() {
    new Promise((resolve) => {
      (async () => {
        await this.loadDirectory('src/server/static/');
        resolve(1);
      })();
    }).then(data => {
      console.log(this.static);
      console.log(this.static.get('/index.html'));
    })
  }

  async loadFile(filePath: string, storage: Map<String, Buffer>) {
    const file = await fsp.readFile(filePath);
    storage.set(filePath, file);
  }

  async loadDirectory(dirPath: string) {
    const files = await fsp.readdir(dirPath, { withFileTypes: true });
    console.log(files); 
    for (const file of files) {
      if (file.name.startsWith('.')) continue;
      const filePath = path.join(dirPath, file.name);
      if (file.isDirectory()) await this.loadDirectory(filePath);
      else await this.loadFile(filePath, this.static);
    }
  }
}

new App()