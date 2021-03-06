const stream = require("stream");
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");
const QueryStream = require("pg-query-stream");

module.exports = class PgsqlInput extends stream.Readable {
  constructor({
    user,
    host,
    port = 5432,
    password,
    database,
    query = "",
    schedule = null
  } = {}) {
    super({ objectMode: true });
    const pool = new Pool({
      user,
      host,
      database,
      password,
      port
    });

    var query = new QueryStream(query);
    this.find(query);

    if (schedule) {
      if (schedule.every) {
        setInterval(() => {
          this.find(query);
        }, TimerParser.parse(schedule.every));
      }
    }
  }

  find(query) {
    var stream = pool.query(query);
    stream.on("data", row => {
      this.push(JSON.stringify(row));
    });
  }

  _read() {}
};
