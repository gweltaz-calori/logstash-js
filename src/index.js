const FileInput = require("./input/FileInput");
const DebugOutput = require("./output/DebugOutput");
const FileOutput = require("./output/FileOutput");
const ReadLineTransform = require("./transform/ReadLineTransform");
const CsvTransform = require("./transform/CsvTransform");

const path = require("path");

const file = new FileInput({
  path: path.resolve(__dirname, "../dataset/myFile.csv")
})
  .pipe(new ReadLineTransform())
  .pipe(new CsvTransform());

file.pipe(new DebugOutput());
file.pipe(
  new FileOutput({
    path: path.resolve(__dirname, "../dataset/output.csv")
  })
);
