import * as ws from 'ws';
import * as http from 'http';
import { threadId } from 'worker_threads';
import { serverConfig } from '../config/server';
import { Client } from './client';
import { Channel } from './channel';

const createServer = (application): http.Server => {
	const listener = (req: http.IncomingMessage, res) => {
		const [domen, command] = req.url.substring(1).split('/');
		if (domen === 'api') { 
			//api[command](req, res);
		} else {
			const client = new Client(req, res, application);
			client.static();
		}
	};
	return http.createServer(listener);
};

export class Server {
	application;
  instance: http.Server;
  ws: ws.Server;

  constructor(application) {
		this.application = application;
		this.instance = createServer(this.application);
		this.ws = new ws.Server({ server: this.instance });
		const { ports } = serverConfig;
    const port = ports[threadId - 1];
    this.ws.on('connection', (connection, req) => {
      const channel = new Channel(connection, application);
      connection.on('message', (data) => {
        channel.message(data);
      })
    });

    this.instance.listen(port, () => {
      this.application.logger.log(`Listen port ${port}`);
    });
  }

  async close() {
    //TODO graceful shutdown
    this.application.logger.log('close');
  }
}
