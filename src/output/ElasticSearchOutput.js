const stream = require("stream");
const http = require("http");
const elasticsearch = require("elasticsearch");

module.exports = class ElasticSearchOuput extends stream.Writable {
  constructor({
    host = null,
    user = null,
    password = null,
    index = null,
    protocol = "http"
  } = {}) {
    super({ objectMode: true });
    this.client = new elasticsearch.Client({
      host: `${protocol}://${user}:${password}@${host}`
    });
    this.index = index;
  }

  _write(chunk, encoding, callback) {
    const chunkString = chunk.toString("utf-8");
    this.client.bulk({
      body: [
        { index: { _index: this.index, _type: "_doc" } },
        JSON.parse(chunkString)
      ]
    });
    callback();
  }
};
