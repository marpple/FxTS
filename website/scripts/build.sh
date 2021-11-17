#!/bin/sh

INPUT_PATH=temp
OUTPUT_PATH=docs

pushd .
cd ../
npm link markdown-plugin

rm -rf $INPUT_PATH
mkdir -p $INPUT_PATH
api-extractor run --local --verbose

rm -rf $OUTPUT_PATH
api-documenter generate --input-folder $INPUT_PATH --output-folder $OUTPUT_PATH
popd
