import { promises as fsp } from 'fs';
import * as fs from 'fs';

export const readStorage = (token: string): Promise<Promise<Buffer>[]> => {
    return fsp.readdir(`./storage/${token}`).then(files => files.map(file => fsp.readFile(`./storage/${token}/${file}`) ) );
};

export const listStorage = (token: string) => {
    return fs.readdirSync(`./storage/${token}`);
};