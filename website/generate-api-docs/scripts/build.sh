#!/bin/sh

INPUT_PATH=temp
OUTPUT_PATH=../docs/api

npm link markdown-plugin

rm -rf $INPUT_PATH
mkdir -p $INPUT_PATH
npx api-extractor run --local --verbose --config ./api-extractor.json
echo "api-extractor done"

rm -rf $OUTPUT_PATH
npx api-documenter generate --input-folder $INPUT_PATH --output-folder $OUTPUT_PATH
