const stream = require("stream");

module.exports = class DebugOutput extends stream.Writable {
  constructor() {
    super({ objectMode: true });
  }

  _write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  }
};
