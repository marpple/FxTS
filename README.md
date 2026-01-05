<img src="./website/docs/public/img/fxts.png" alt="FxTS Logo" width="120" />

# FxTS

[![Build Status](https://github.com/marpple/FxTS/actions/workflows/ci.yml/badge.svg)](https://github.com/marpple/FxTS/actions)
[![npm version](https://badge.fury.io/js/@fxts%2Fcore.svg)](https://www.npmjs.com/package/@fxts/core)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](./LICENSE)

FxTS is a functional programming library for TypeScript.

- Provides [lazy evaluation](https://fxts.dev/docs/lazy-evaluation) for memory-efficient data processing with functions like [pipe](https://fxts.dev/docs/pipe), [map](https://fxts.dev/docs/map), [filter](https://fxts.dev/docs/filter), and [take](https://fxts.dev/docs/take).
- Handles [concurrent requests](https://fxts.dev/docs/handle-concurrency) efficiently with [concurrent](https://fxts.dev/docs/concurrent) and [toAsync](https://fxts.dev/docs/toAsync).
- Offers excellent TypeScript support with strong [type inference](https://fxts.dev/docs/getting-started#type-inference).
- Follows standard [iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) (Iterable/AsyncIterable).

## Installation

```
npm install @fxts/core
```

## Usage

Use `pipe` for function composition or `fx` for method chaining:

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

## Usage (concurrent)

Handle multiple async operations in parallel with `concurrent`:

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

## Documentation

For more information, visit [fxts.dev](https://fxts.dev).

For LLM-friendly documentation, see [llms.txt](https://fxts.dev/llms.txt).

## Contributing

We welcome contributions from everyone in the community. Please read our [Contributing Guide](./CONTRIBUTING.md).

## License

Apache License 2.0 © [Marpple](https://www.marpple.com). See [LICENSE](./LICENSE) for details.
