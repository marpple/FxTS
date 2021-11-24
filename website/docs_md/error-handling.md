---
id: error-handling
---

# Error handling

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
  await pipe(
    [
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
