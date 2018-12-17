const stream = require("stream");
module.exports = class MutateTransform extends stream.Transform {
  constructor({ rename_field = {} } = {}) {
    super({ objectMode: true });
    this.rename_field = rename_field;
  }

  _transform(chunk, encoding, callback) {
    const chunkString = chunk.toString("utf8");
    const chunkObject = JSON.parse(chunkString);
    for (let key in this.rename_field) {
      const newKey = this.rename_field[key];
      chunkObject[newKey] = chunkObject[key];
      delete chunkObject[key];
    }

    this.push(JSON.stringify(chunkObject));

    callback();
  }
};
