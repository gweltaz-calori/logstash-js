#!/usr/bin/env node

const FileInput = require("./input/FileInput");
const DebugOutput = require("./output/DebugOutput");
const FileOutput = require("./output/FileOutput");
const ReadLineTransform = require("./transform/ReadLineTransform");
const CsvTransform = require("./transform/CsvTransform");

const STREAMS = {
  input: {
    file: FileInput
  },
  transform: {
    csv: CsvTransform
  },
  output: {
    file: FileOutput,
    debug: DebugOutput
  }
};

function parseConfig() {
  const config = require(`${process.cwd()}/${process.argv[2]}`);
  let inputStream = null;
  let mainTransformStream = null;
  for (let inputName in config.input) {
    inputStream = new STREAMS.input[inputName](config.input[inputName] || {});
  }

  mainTransformStream = inputStream.pipe(new ReadLineTransform());

  for (let transformName in config.transform) {
    const transformStream = new STREAMS.transform[transformName](
      config.transform[transformName] || {}
    );
    mainTransformStream = mainTransformStream.pipe(transformStream);
  }

  for (let outputName in config.output) {
    const outputStream = new STREAMS.output[outputName](
      config.output[outputName] || {}
    );
    mainTransformStream.pipe(outputStream);
  }
}

parseConfig();
