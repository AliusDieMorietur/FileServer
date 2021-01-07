import { promises as fsp } from 'fs';

export const readStorage = (token: string): Promise<Promise<Buffer>[]> => {
    return fsp.readdir(`./storage/${token}`).then(files => files.map(file => fsp.readFile(`./storage/${token}/${file}`) ) );
};