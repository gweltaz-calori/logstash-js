const stream = require("stream");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql");
const MongoClient = require("mongodb").MongoClient;
const TimerParser = require("../utils/TimerParser");

module.exports = class MongodbInput extends stream.Readable {
  constructor({
    user,
    host,
    port = 27017,
    password,
    database,
    collection,
    query,
    schedule = null
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
        this.find(dbCollection, query);

        if (schedule) {
          if (schedule.every) {
            setInterval(() => {
              this.find(dbCollection, query);
            }, TimerParser.parse(schedule.every));
          }
        }
      }
    );
  }

  find(dbCollection, query) {
    const cursor = dbCollection.find(JSON.parse(query));
    cursor.on("data", doc => {
      this.push(JSON.stringify(doc));
    });
  }

  _read() {}
};
