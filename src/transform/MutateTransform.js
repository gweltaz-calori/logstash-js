const stream = require("stream");
module.exports = class MutateTransform extends stream.Transform {
  constructor({ rename_field = {}, add_field = {}, remove_field = [] } = {}) {
    super({ objectMode: true });
    this.rename_field = rename_field;
    this.add_field = add_field;
    this.remove_field = remove_field;
  }

  _transform(chunk, encoding, callback) {
    const chunkString = chunk.toString("utf8");
    const chunkObject = JSON.parse(chunkString);
    for (let key in this.rename_field) {
      const newKey = this.rename_field[key];
      chunkObject[newKey] = chunkObject[key];
      delete chunkObject[key];
    }

    for (let key in this.add_field) {
      const value = this.add_field[key];
      chunkObject[key] = value;
    }

    for (let key of this.remove_field) {
      delete chunkObject[key];
    }

    this.push(JSON.stringify(chunkObject));

    callback();
  }
};
