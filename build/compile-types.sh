#!/bin/sh
mv ./src/types/Awaited.ts ./build/Awaited4-5.ts
mv ./build/Awaited4-2.ts ./src/types/Awaited.ts

npm i typescript@4.2 -D --legacy-peer-deps
npm run compile:types4-2

mv ./src/types/Awaited.ts ./build/Awaited4-2.ts
mv ./build/Awaited4-5.ts ./src/types/Awaited.ts

npm i typescript@rc -D --legacy-peer-deps
npm run compile:types4-5
