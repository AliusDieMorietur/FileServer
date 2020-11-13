class Transport {
  constructor(host) {
    this.socket = new WebSocket('ws://' + host);
    this.api = {};
    this.callId = 0;
    this.calls = new Map();
    this.socket.addEventListener('message', ({ data }) => {
      try {
        const packet = JSON.parse(data);
        const { callId } = packet
        const promised = this.calls.get(callId);
        if (!promised) return;
        const [resolve, reject] = promised;
        if (packet.error) {
          const { code, message } = packet.error;
          const error = new Error(message);
          error.code = code;
          reject(error);
          return;
        }
        resolve(packet.result);
      } catch (err) {
        console.error(err);
      }
    });
  }

  ready() {
    return new Promise(resolve => {
      if (this.socket.readyState === WebSocket.OPEN) resolve();
      else this.socket.addEventListener('open', resolve);
    });
  }

  async load(...methods) {
    for (const methodName of methods) {
      this.api[methodName] = this.socketCall(methodName);
    }
  }

  socketCall(methodName) {
    return async (...args) => {
      const callId = ++this.callId;
      await this.ready();
      return new Promise((resolve, reject) => {
        this.calls.set(callId, [resolve, reject]);
        const packet = { call: callId, [methodName]: args };
        this.socket.send(JSON.stringify(packet));
      });
    };
  }
};