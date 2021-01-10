import { promises as fsp } from 'fs';
import * as fs from 'fs';

const readStorage = (token: string): Promise<Promise<Buffer>[]> => {
  return fsp.readdir(`./storage/${token}`).then(files => files.map(file => fsp.readFile(`./storage/${token}/${file}`) ) );
};

const listStorage = (token: string) => {
  return fs.readdirSync(`./storage/${token}`);
};

export { readStorage, listStorage }