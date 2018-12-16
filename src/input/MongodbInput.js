const stream = require("stream");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql");
const MongoClient = require("mongodb").MongoClient;

module.exports = class MongodbInput extends stream.Readable {
  constructor({
    user,
    host,
    port = 27017,
    password,
    database,
    collection,
    query
  } = {}) {
    super({ objectMode: true });
    MongoClient.connect(
      `mongodb://${user}:${password}@${host}:${port}`,
      { useNewUrlParser: true },
      (err, client) => {
        if (err) {
          throw new Error("[ERROR] Cant't connect to mongodb");
        }

        const db = client.db(database);
        const dbCollection = db.collection(collection);
        const cursor = dbCollection.find(JSON.parse(query));
        cursor.on("data", doc => {
          this.push(JSON.stringify(doc));
        });
      }
    );
  }

  _read() {}
};
