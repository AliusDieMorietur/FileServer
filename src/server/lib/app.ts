'use strict';
import { serverConfig } from '../config/server';
import { Worker } from 'worker_threads'; 

class App {
  count: number
  workers: Array<Worker>
  constructor() {
    this.count = serverConfig.ports.length;
    this.workers = new Array(this.count);
  }
  
  private stop = async () => {
    for (const worker of this.workers) {
      worker.postMessage({ name: 'stop' });
    }
    process.exit(0);
  };

  private startWorker = id => {
    const worker = new Worker('./target/lib/worker.js');
    this.workers[id] = worker;
    worker.on('exit', code => {
      if (code !== 0) this.startWorker(id);
    });
  };

  async start () {
    for (let id = 0; id < this.count; id++) this.startWorker(id);

    process.on('SIGINT', this.stop);
    process.on('SIGTERM', this.stop);
  }
  
}

export { App };