import * as ws from 'ws';
import * as fs from 'fs'
import * as path from 'path';
import { generateToken } from './auth';
const fsp = fs.promises;

const STORAGE_PATH = path.join(process.cwd(), './storage/');
const NAMES_PATH = path.join(process.cwd(), 'names.json');

const readNames = async () => {
	let names = await fsp.readFile(NAMES_PATH);
	names = names.toString().length > 0 
		? JSON.parse(names.toString())
		: {};
	return names;
}

const appendNames = async (token, object) => {
	const names = await readNames();
	names[token] = object;
	await fsp.writeFile(NAMES_PATH, JSON.stringify(names));
}

const actions = {
  'file-names': async (mediator, call, args) => {
    const { list } = args;
		mediator.token = generateToken();
		const dirPath = path.join(STORAGE_PATH, mediator.token);
    await fsp.mkdir(dirPath);
    
		const savedNames = {};
		for (const fileName of list) savedNames[fileName] = generateToken();
    await appendNames(mediator.token, savedNames);
    const fileNames: string[] = Object.values(savedNames);
    
		if (mediator.buffers.length !== fileNames.length) {
      let err = 'Buffers or it`s names corrupted';
			mediator.logger.error(err);
			mediator.send(JSON.stringify({ callId: call, error: { message: err, code: 1 } }));
			return;
		}

		for (let i = 0; i < fileNames.length; i++) {
			const fileName = path.join(STORAGE_PATH, mediator.token, fileNames[i]);
			const buffer = mediator.buffers[i];
			await fsp.writeFile(fileName, buffer);
		}
		
		mediator.buffers = [];
    mediator.send(JSON.stringify({ callId: call, result: mediator.token }));
  },
  'available-files': async (mediator, call, args) => {
		const { token } = args;
		try {
      const list = await readNames();
      mediator.send(JSON.stringify({ callId: call, result: list[token] }));
		} catch (err) {
      mediator.logger.error(err);
      mediator.send(JSON.stringify({ callId: call, error: err }));
		}
  },
  'download': async (mediator, call, args) => {
    const { files, token } = args;
    let list = await readNames();
    for (const file of files) {
      const buffer = await fsp.readFile(path.join(STORAGE_PATH, token, list[token][file]));
      mediator.send(buffer);
    }
    mediator.send(JSON.stringify({ callId: call, result: files }));
  }
};

export class Channel {
  private application;
  private connection;
  private token: string;
  private buffers = [];

  constructor(connection: ws, application) {
    this.connection = connection;
    this.application = application;
  }

  async message(data) {
    try {
      if (typeof data === 'string') {
        const packet = JSON.parse(data);
        console.log('packet: ', packet);
        const { call, msg, args } = packet;
        actions[msg](this, call, args);
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