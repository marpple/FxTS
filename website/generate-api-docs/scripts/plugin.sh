#!/bin/sh

cd ./markdown-plugin && \
npm install && \
npm run build && \
npm link