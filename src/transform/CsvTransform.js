const stream = require("stream");
module.exports = class CsvTransform extends stream.Transform {
  constructor({ delimiter = "," } = {}) {
    super({ objectMode: true });
    this.delimiter = delimiter;
    this.headers = [];
  }

  _transform(chunk, encoding, callback) {
    let isHeader = false;
    const chunkString = chunk.toString("utf-8");
    const columns = chunkString.split(this.delimiter);

    if (this.headers.length === 0) {
      this.headers = columns;
      isHeader = true;
    }

    if (!isHeader) {
      const row = {};
      for (let i = 0; i < this.headers.length; i++) {
        row[this.headers[i]] = columns[i];
      }

      this.push(JSON.stringify(row));
    }

    callback();
  }
};
