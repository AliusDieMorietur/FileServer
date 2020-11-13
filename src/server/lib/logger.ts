import * as fs from 'fs';
import * as util from 'util';

const COLORS = {
  info: '\u001b[37m',
  error: '\u001b[31m',
  warning: '\u001b[33m',
  success: '\u001b[32m',
  ext: '\u001b[34m'
};

const DATETIME_LENGTH = 19;

const log = (color, value) => {
  console.log();
};


class Logger { 
  stream
  constructor() {
    const date = new Date();
    this.stream = fs.createWriteStream('./target/logs/log.txt', { flags: 'a' });
  }

  write(level, s) {
    const now = new Date().toISOString();
    const date = now.substring(0, DATETIME_LENGTH);
    const color = COLORS[level];
    const line = date + '\t' + s;
    console.log(color + line + '\x1b[0m');
    this.stream.write(line);
  }

  log(...args) {
    const msg = util.format('', ...args);
    this.write('info', msg);
  }

  error(...args) {
    const msg = util.format('', ...args);
    this.write('error', msg);
  }

  success(...args) {
    const msg = util.format('', ...args);
    this.write('success', msg);
  }

  ext(...args) {
    const msg = util.format('', ...args);
    this.write('ext', msg);
  }
}

const logger = new Logger();

export { logger };