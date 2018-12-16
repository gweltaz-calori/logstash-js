const stream = require("stream");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql");

module.exports = class MysqlInput extends stream.Readable {
  constructor({ user, host, password, database, query } = {}) {
    super({ objectMode: true });
    this.connection = mysql.createConnection({
      host,
      user,
      password,
      database
    });
    this.connection.connect(err => {
      if (err) {
        console.log("[ERROR] Cant't connect to mysql");
      } else {
        const queryBuilder = this.connection.query(query);
        queryBuilder.on("result", row => {
          this.push(JSON.stringify(row));
        });
      }
    });
  }

  _read() {}
};
