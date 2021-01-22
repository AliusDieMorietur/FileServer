import { generateToken } from './auth';
import * as path from 'path';
import * as fs from 'fs'
const fsp = fs.promises;

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
	'file-names': async (mediator, packet) => {
		mediator.token = generateToken();
		const dirPath = path.join(mediator.storagePath, mediator.token);
		await fsp.mkdir(dirPath);
		const savedNames = {};
		const { list } = packet;
		for (const fileName of list) savedNames[fileName] = generateToken();
		console.log(savedNames);
		await appendNames(mediator.token, savedNames);
	},
	'done': async (mediator) => {
		const generatedNames = await readNames();
		const fileNames: string[] = Object.values(generatedNames[mediator.token]);

		if (mediator.buffers.length !== fileNames.length) {
			mediator.logger.error('Buffers or it`s names corrupted');
			mediator.send(JSON.stringify({ msg: 'transfer-error' }));
			return;
		}

		for (let i = 0; i < fileNames.length; i++) {
			const fileName = path.join(mediator.storagePath, mediator.token, fileNames[i]);
			const buffer = mediator.buffers[i];
			await fsp.writeFile(fileName, buffer);
		}
		
		mediator.buffers = [];
		mediator.send(JSON.stringify({ msg: 'token', token: mediator.token }));
	},
	'available-files': async (mediator, packet) => {
		const { token } = packet;
		try {
			const list = await readNames();
			mediator.send(JSON.stringify({ msg: 'available-files', dataList: list[token] }));
		} catch (err) {
			mediator.logger.error(err);
			mediator.send(JSON.stringify({ msg: 'non-existent-token' }));
		}
	},
	'dowmload': async (mediator, packet) => {
		const { token } = packet;
		const { file } = packet;
		const buffers = [];
		const list = file 
			? [file] 
			: await fsp.readdir(path.join(mediator.storagePath, token));
		if (file) {
			const buffer = await fsp.readFile(path.join(mediator.storagePath, token, file));
			buffers.push(buffer);
		} else {

		}
	}
};

type Logger = { log, error };

export class Loader {
	private connection;
	private logger: Logger;
	private storagePath: string;
	private token: string;
	private buffers: Buffer[] = [];
	constructor(connection, storagePath: string, logger? : Logger) {
		this.connection = connection;
		this.logger = logger ? logger : console;
		this.storagePath = storagePath;
	}
	
	async message(data) {
		try {
			if (typeof data === 'string') {
				const packet = JSON.parse(data);
				const { msg } = packet;
				console.log(packet);
				if (actions[msg]) {
					await actions[msg](this, packet);
					return;
				};
				this.logger.error('non-existent message');
			} else {
				console.log(data);
				this.buffers.push(data);
				console.log('saved Buffer');
			}
		} catch (err) {
			this.logger.error(err);
		}
	}

	send(data) {
		try {
      this.connection.send(data);
    } catch (err) {
      this.logger.error(err);
    }
	}
}