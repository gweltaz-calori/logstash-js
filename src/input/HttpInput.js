const stream = require("stream");
const path = require("path");
const fs = require("fs");
const url = require("url");

module.exports = class HttpInput extends stream.Readable {
  constructor({
    path = null,
    method = "GET",
    headers = {},
    user = null,
    password = null
  } = {}) {
    super({ objectMode: true });
    const http = path.includes("https") ? require("https") : require("http");
    const parsedUrl = url.parse(path);
    const req = http.request(
      {
        hostname: parsedUrl.hostname,
        protocol: parsedUrl.protocol,
        path: parsedUrl.path,
        method,
        headers,
        username: user,
        password: password
      },
      res => {
        res.on("data", chunk => {
          this.push(chunk);
        });
      }
    );

    req.end();
  }

  _read() {}
};
