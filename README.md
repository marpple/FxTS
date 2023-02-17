![Build Status](https://github.com/marpple/FxTS/actions/workflows/ci.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@fxts%2Fcore.svg)](https://badge.fury.io/js/@fxts%2Fcore)

💬 [Join the FxTS Slack community(en)](https://join.slack.com/t/fx-ts-en/shared_invite/zt-z3heqgyc-al69EU_l95xnjeMRfvdoMA)
💬 [Join the FxTS Slack community(ko)](https://join.slack.com/t/fx-ts/shared_invite/zt-yw1x81zq-pNa8nM40X6mQAsu2L4m1Fw)

# ![fxts-icon](https://user-images.githubusercontent.com/10924072/141757649-cc715e62-21bb-441d-aeae-4732154ded10.png) FxTS

FxTS is a functional library for TypeScript/JavaScript programmers.

### Why FxTS?

- Lazy evaluation
- Handling concurrent requests
- Type inference
- Follow [iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) Iterable / AsyncIterable

## Installation

```
npm install @fxts/core
```

## Documentation

Please review the [API documentation](https://fxts.dev/docs/index)

## Usage

```ts
import { each, filter, map, pipe, range, take } from "@fxts/core";

pipe(
  range(10),
  map((a) => a + 10),
  filter((a) => a % 2 === 0),
  take(2),
  each((a) => console.log(a)),
);
```

## Usage(concurrent)

```ts
import { concurrent, countBy, flat, map, pipe, toAsync } from "@fxts/core";

// maybe 1 seconds api
const fetchWiki = (page: string) =>
  fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${page}`);

const countWords = async (concurrency = 1) =>
  pipe(
    ["html", "css", "javascript", "typescript"],
    toAsync,
    map(fetchWiki),
    map((res) => res.text()),
    map((words) => words.split(" ")),
    flat,
    concurrent(concurrency),
    countBy((word) => word),
  );

await countWords(); // 4 seconds
await countWords(2); // 2 seconds
```

you can start [here](http://fxts.dev/docs/getting-started)

## Build

- `npm run build`

## Running Test

- `npm test`

## Running Type Test

- `npm run compile:check`

## License

Apache License 2.0
