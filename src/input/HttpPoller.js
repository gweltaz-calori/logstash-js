const stream = require("stream");
const path = require("path");
const fs = require("fs");

module.exports = class HttpPollerInput extends stream.Readable {
  constructor({
    path = null,
    method = "GET",
    headers = {},
    user = null,
    password = null,
    schedule = null
  } = {}) {
    super({ objectMode: true });
  }

  _read() {}
};
