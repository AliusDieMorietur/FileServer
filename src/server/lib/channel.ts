import { IncomingMessage } from 'http';
import * as ws  from 'ws';


export class Channel {
  private req
  private application;
  private ip
  private connection
  private incomingCount: number
  private token: string

  constructor(req: IncomingMessage, connection: ws, application) {
    this.req = req;
    this.ip = req.socket.remoteAddress;
    this.connection = connection;
    this.application = application;
  }

  async message(data) {
    try {
      console.log(data);      
    } catch (error) {
      this.application.logger.log(error);
    }
  }

  send(data) {
    try {
      this.connection.send(data);
    } catch (error) {
      this.application.logger.log(error);
    }
  }
}