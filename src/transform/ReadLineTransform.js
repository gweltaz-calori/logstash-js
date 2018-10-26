const stream = require("stream");

const lineBreak = /\r?\n/;

module.exports = class ReadLineTransform extends stream.Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(chunk, encoding, callback) {
    const chunkString = chunk.toString("utf8");
    const lines = chunkString.split(lineBreak);
    for (let i = 0; i < lines.length; i++) {
      this.push(lines[i]);
    }

    callback();
  }
};
