const stream = require("stream");
const http = require("http");

module.exports = class ElasticSearchOuput extends stream.Writable {
  constructor({
    host = null,
    user = null,
    password = null,
    index = null
  } = {}) {
    super({ objectMode: true });
  }

  _write(chunk, encoding, callback) {
    const chunkString = chunk.toString("utf-8");
    callback();
  }
};
