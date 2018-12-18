const stream = require("stream");
const http = require("http");
const elasticsearch = require("elasticsearch");

module.exports = class ElasticSearchOuput extends stream.Writable {
  constructor({
    host = null,
    user = null,
    password = null,
    index = null,
    protocol = "http",
    document_id = null
  } = {}) {
    super({ objectMode: true });
    this.client = new elasticsearch.Client({
      host: `${protocol}://${user}:${password}@${host}`
    });
    this.index = index;
    this.document_id = document_id;
  }

  _write(chunk, encoding, callback) {
    const chunkString = chunk.toString("utf-8");

    const doc = JSON.parse(chunkString);

    const indexBody = { index: { _index: this.index, _type: "_doc" } };

    if (this.document_id) {
      indexBody.index._id = doc[this.document_id];
    }

    this.client.bulk({
      body: [indexBody, doc]
    });
    callback();
  }
};
