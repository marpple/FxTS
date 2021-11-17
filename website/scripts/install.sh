#!/bin/sh

pushd .
cd ../../
npm install
npm run compile
popd

pushd .
cd ../markdown-plugin
npm install
npm run build
popd

npm install
