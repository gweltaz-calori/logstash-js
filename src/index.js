#!/usr/bin/env node

const FileInput = require("./input/FileInput");
const JsonInput = require("./input/JsonInput");
const HttpInput = require("./input/HttpInput");
const MysqlInput = require("./input/MysqlInput");
const PgsqlInput = require("./input/PgsqlInput");
const MongodbInput = require("./input/MongodbInput");
const DebugOutput = require("./output/DebugOutput");
const FileOutput = require("./output/FileOutput");
const ElasticSearchOutput = require("./output/ElasticSearchOutput");
const ReadLineTransform = require("./transform/ReadLineTransform");
const CsvTransform = require("./transform/CsvTransform");
const MutateTransform = require("./transform/MutateTransform");

const STREAMS = {
  input: {
    json: JsonInput,
    file: FileInput,
    http: HttpInput,
    mysql: MysqlInput,
    pgsql: PgsqlInput,
    mongodb: MongodbInput
  },
  transform: {
    csv: CsvTransform,
    mutate: MutateTransform
  },
  output: {
    file: FileOutput,
    debug: DebugOutput,
    elasticsearch: ElasticSearchOutput
  }
};

function parseEnvVariables(obj) {
  for (let key in obj) {
    let value = obj[key];
    if (typeof value === "object") {
      parseEnvVariables(value);
    } else {
      let matches = [];
      const regex = /\${([a-zA-Z0-9_]+)}/g;
      while ((matches = regex.exec(value))) {
        if (!process.env[matches[1]]) {
          throw new Error(
            `[ERROR] Environnement variable ${matches[1]} not found`
          );
        }
        obj[key] = obj[key].replace(matches[0], process.env[matches[1]]);
      }
    }
  }
}

function parseConfig() {
  const config = require(`${process.cwd()}/${process.argv[2]}`);
  let inputStream = null;
  let mainTransformStream = null;
  for (let inputName in config.input) {
    parseEnvVariables(config.input[inputName]);
    inputStream = new STREAMS.input[inputName](config.input[inputName] || {});
    mainTransformStream = inputStream;
  }

  if (config.transform && config.transform.csv) {
    mainTransformStream = inputStream.pipe(new ReadLineTransform());
  }

  for (let transformName in config.transform) {
    const transformStream = new STREAMS.transform[transformName](
      config.transform[transformName] || {}
    );
    mainTransformStream = mainTransformStream.pipe(transformStream);
  }

  for (let outputName in config.output) {
    parseEnvVariables(config.output[outputName]);
    const outputStream = new STREAMS.output[outputName](
      config.output[outputName] || {}
    );
    mainTransformStream.pipe(outputStream);
  }
}
parseConfig();
