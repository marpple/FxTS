---
id: overview
---

# Overview

## Introduction

FxTS is a library for functional programming using iterable/asyncIterable.
It provides users to write more declarative code, as well as to handle asynchronous data and functions.

To build the above, we have many features such as:

- Lazy evaluation
  - It is a useful way to represent large or possibly infinite enumerable data.
- Handling concurrent requests
  - It can handle multiple asynchronous requests and also control the count of requests.
- Type inference
  - Function composition can be inferred.
- Follow [iteration protocal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) Iterable / AsyncIterable
  - FxTS follows the protocol of the language standard.
    This means that it matches well with existing functions and functions that will be added in the future.

## Examples

### Normal

We provide [lazy evaluation](https://en.wikipedia.org/wiki/Lazy_evaluation).

```ts
import { pipe, peek, range, map, filter, take, toArray } from "@fxts/core";

pipe(
  range(100),
  peek((a) => console.log(a)), // log 4 times (1,2,3,4)
  map((a) => a + 10),
  filter((a) => a % 2 === 0),
  take(2),
  toArray,
);
```

Even if you do `filter` after `map`, it doesn't matter. 2 items are extracted, (only 4 items are evaluated 1,2,3,4). Lazy functions can be found [here](https://fxts.dev/docs/index#lazy)

### Function composition

Combinations of `Lazy` functions don't evaluate actual values like [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).
It can be evaluated with a Strict(`toArray`) or [for-of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of), [await for-of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of). Strict functions can be found [here](https://fxts.dev/docs/index#strict)

```ts
import { pipe, range, map, filter, take, toArray } from "@fxts/core";

const nums = pipe(
  range(Infinity),
  map((a) => a * a),
  take(3),
); // not evaluated not yet

const result = pipe(
  nums,
  filter((a) => a % 2 === 0),
  toArray, // Strict function
);
```

### Handling asynchronous data

When dealing with asynchronous values

```ts
import { pipe, peek, range, map, filter, take, toArray } from "@fxts/core";

await pipe(
  Promise.resolve([1, 2, 3, 4]),
  toAsync,
  map((a) => a + 10),
  // map(async (a) => a + 10), // also possible
  filter((a) => a % 2 === 0),
  take(2),
  toArray,
);
```

When asynchronous values are contained in an array

```ts
import { pipe, toAsync, peek, range, map, filter, take, toArray } from "@fxts/core";

await pipe([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
    Promise.resolve(4),
  ]),
  toAsync,
  map((a) => a + 10),
  filter((a) => a % 2 === 0),
  take(2),
);
```

### Concurrent

It handles multiple asynchronous requests and also controls the count of requests

```ts
import { pipe, toAsync, delay, peek, range, map, filter, take } from "@fxts/core";

await pipe(
  toAsync(range(Infinity)),
  map((page) => delay(1000, page)), // 0,1,2,3,4,5
  filter((a) => a % 2 === 0),
  take(3), // 0,2,4
  concurrent(3),
  toArray, // 1 seconds
);
```

You can see that it takes 6 seconds when requesting one by one but takes 2 seconds when requesting using [concurrent](https://fxts.dev/docs/concurrent)

A more practical code is below.

<iframe src="https://codesandbox.io/embed/fxts-concurrent-useful-0frg2?fontsize=14&hidenavigation=1&theme=dark"
     style={{height:800, width:"100%", border:0, borderRadius:4,overflow:"hidden"}}
     title="fxts-concurrent-useful"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

### Error handle

Since FxTS follows the protocol of standard, you can easily handle errors with `try-catch`.

- synchronous

```ts
import { pipe, toAsync, toArray } from "@fxts/core";

try {
  pipe(
    [1, 2, 3, 4, 5],
    map((a) => {
      throw "err";
    }),
    toArray,
  );
} catch (err) {
  // handle err
}
```

- asynchronous

```ts
import { pipe, toAsync, map, toArray } from "@fxts/core";

try {
  await pipe(
    Promise.resolve([1, 2, 3, 4, 5]),
    toAsync,
    map(async (a) => {
      throw "err";
    }),
    toArray,
  );
} catch (err) {
  // handle err
}
```


```ts
import { pipe, toAsync, map, toArray } from "@fxts/core";

try {
  await pipe([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
      Promise.resolve(4),
    ],
    toAsync,
    map(async (a) => {
      throw "err";
    }),
    toArray,
  );
} catch (err) {
  // handle err
}
```
