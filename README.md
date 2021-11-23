💬 [Join the FxTS Slack community(en)](https://join.slack.com/t/fx-ts-en/shared_invite/zt-z3heqgyc-al69EU_l95xnjeMRfvdoMA)
💬 [Join the FxTS Slack community(ko)](https://join.slack.com/t/fx-ts/shared_invite/zt-yw1x81zq-pNa8nM40X6mQAsu2L4m1Fw)

# ![fxts-icon](https://user-images.githubusercontent.com/10924072/141757649-cc715e62-21bb-441d-aeae-4732154ded10.png) FxTS

FxTS is a functional library for TypeScript/JavaScript programmers.

### Why FxTS?

- Lazy evaluation
- Handling concurrent requests
- Type inference
- Follow [iteration protocal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) Iterable / AsyncIterable

## Installation

```
npm install @fxts/core
```

## Documentation

Please review the [API documentation](https://fxts.dev/docs/index)

## Usage

```ts
import { pipe, range, map, filter, take, each } from "@fxts/core";

pipe(
  range(10),
  map((a) => a + 10),
  filter((a) => a % 2 === 0),
  take(2),
  each((a) => console.log(a)),
);
```

Concurrency

```ts
// prettier-ignore
import { pipe, range, toAsync, map, takeWhile, flat, concurrent, countBy } from "@fxts/core";

const delay1000 = () => new Promise((resolve) => setTimeout(resolve, 1000));
const words = ["html", "css", "javascript", "typescript"];
const fetchWords = (a: number) => delay1000().then(() => (a < 9 ? words : []));

const countWords = async (concurrency = 1) =>
  pipe(
    range(Infinity),
    toAsync,
    map(fetchWords),
    takeWhile(({ length }) => length > 0),
    flat,
    concurrent(concurrency),
    countBy((word) => word),
    console.log,
  );

async function main() {
  try {
    await countWords(); // 10 seconds
    await countWords(5); // 2 seconds
  } catch (e) {
    // error handle
  }
}
main();
```

you can also handle asynchronous data, see the [example](https://fxts.dev/docs/overview#examples)

## Build

- `npm run build`

## Running Test

- `npm test`

## Running Type Test

- `npm run compile:check`

## License

Apache License 2.0
