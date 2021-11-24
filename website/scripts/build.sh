#!/bin/sh

INPUT_PATH=temp
OUTPUT_PATH=docs

npm link markdown-plugin

rm -rf $INPUT_PATH
mkdir -p $INPUT_PATH
api-extractor run --local --verbose
echo "api-extractor done"

rm -rf $OUTPUT_PATH
api-documenter generate --input-folder $INPUT_PATH --output-folder $OUTPUT_PATH
