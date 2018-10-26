const stream = require("stream");
const path = require("path");
const fs = require("fs");

module.exports = class FileInput extends stream.Readable {
  constructor({ path = null } = {}) {
    super({ objectMode: true });
    this.stream = fs.createReadStream(path);
    this.stream.on("data", data => {
      this.push(data);
    });
  }

  _read() {}
};
