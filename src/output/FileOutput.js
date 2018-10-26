const stream = require("stream");
const fs = require("fs");

module.exports = class FileOutput extends stream.Writable {
  constructor({ path = null } = {}) {
    super({ objectMode: true });
    this.path = path;
  }

  _write(chunk, encoding, callback) {
    const chunkString = chunk.toString("utf-8");
    fs.appendFile(this.path, chunkString, err => {
      callback();
    });
  }
};
