![Build Status](https://github.com/marpple/FxTS/actions/workflows/ci.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@fxts%2Fcore.svg)](https://badge.fury.io/js/@fxts%2Fcore)

# ![fxts-icon](https://github.com/marpple/FxTS/assets/10924072/415500c9-12ce-4aec-8563-835514b94b22) FxTS

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
import { each, filter, fx, map, pipe, range, take } from "@fxts/core";

pipe(
  range(10),
  map((a) => a + 10),
  filter((a) => a % 2 === 0),
  take(2),
  each((a) => console.log(a)),
);

// chaining
fx(range(10))
  .map((a) => a + 10)
  .filter((a) => a % 2 === 0)
  .take(2)
  .each((a) => console.log(a));
```

## Usage(concurrent)

```ts
import { concurrent, countBy, flat, fx, map, pipe, toAsync } from "@fxts/core";

// maybe 1 seconds api
const fetchWiki = (page: string) =>
  fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${page}`);

const countWords = async (concurrency: number) =>
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
