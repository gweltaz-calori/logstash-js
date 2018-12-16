#!/usr/bin/env node

const FileInput = require("./input/FileInput");
const HttpInput = require("./input/HttpInput");
const MysqlInput = require("./input/MysqlInput");
const PgsqlInput = require("./input/PgsqlInput");
const MongodbInput = require("./input/MongodbInput");
const DebugOutput = require("./output/DebugOutput");
const FileOutput = require("./output/FileOutput");
const ElasticSearchOutput = require("./output/ElasticSearchOutput");
const ReadLineTransform = require("./transform/ReadLineTransform");
const CsvTransform = require("./transform/CsvTransform");

const STREAMS = {
  input: {
    file: FileInput,
    http: HttpInput,
    mysql: MysqlInput,
    pgsql: PgsqlInput,
    mongodb: MongodbInput
  },
  transform: {
    csv: CsvTransform
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
      const groups = value.match(/\${(.+)}/);
      if (groups !== null) {
        obj[key] = process.env[groups[1]];
        if (!obj[key]) {
          throw new Error(
            `[ERROR] Environnement variable ${groups[1]} not found`
          );
        }
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
