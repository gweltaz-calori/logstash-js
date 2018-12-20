const StreamArray = require("stream-json/streamers/StreamArray");
const stream = require("stream");
const path = require("path");
const fs = require("fs");

module.exports = class JsonInput extends stream.Readable {
  constructor({ path = null } = {}) {
    super({ objectMode: true });
    this.stream = fs.createReadStream(path).pipe(StreamArray.withParser());
    this.stream.on("data", ({ value }) => {
      this.push(JSON.stringify(value));
    });
  }

  _read() {}
};
