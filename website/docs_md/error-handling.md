---
id: error-handling
---

# Error handling

Error handling is an essential part of any programming.

Unlike other libraries, error handling in FxTS does not need to know a specific error handling part.
Since FxTS follows the protocol of standard, you can easily handle errors with `try-catch`.
This means that synchronous/asynchronous error propagation is possible,
so it is good to use with [sentry](https://sentry.io/) or various 3rd party error logging and debugging tools.

### Synchronous error handling

```typescript
import { pipe, toAsync, take, map, toArray } from "@fxts/core";

const syncError = (a) => {
  throw new Error(`err ${a}`);
};

try {
  pipe(
    [1, 2, 3, 4, 5],
    map(syncError),
    filter((a) => a % 2 === 0),
    toArray,
  );
} catch (err) {
  // handle err
}
```

### Asynchronous error handling

```typescript
import { pipe, toAsync, map, filter, toArray } from "@fxts/core";

const fetchAsyncError = (a) => Promise.reject(`err ${a}`);

try {
  await pipe(
    Promise.resolve([1, 2, 3, 4, 5]),
    toAsync,
    map(fetchAsyncError),
    filter((a) => a % 2 === 0),
    toArray,
  );
} catch (err) {
  // handle err
}

try {
  await pipe(
    [
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
      Promise.resolve(4),
    ],
    toAsync,
    map(fetchAsyncError),
    filter((a) => a % 2 === 0),
    toArray,
  );
} catch (err) {
  // handle err
}
```

### Concurrency error handling (using Concurrent)

In the state of concurrent requests, `AsyncIterable` is evaluated as many as the number of `concurrent` requests, even if an error occurred earlier.
This is the same case where asynchronous requests are executed with [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all),
`Promise.all` is all executed even if one fails.

```typescript
import { pipe, toAsync, map, filter, concurrent, toArray } from "@fxts/core";

const fetchAsyncError = (a) => {
  if (a === 3) {
    return Promise.reject(`err ${a}`);
  }
  return a;
};

try {
  await pipe(
    [
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3), // When this item is evaluated, `map` function throws an error.
      Promise.resolve(4), // This item is also evaluated.
      Promise.resolve(5), // Is is not evaluated from this item.
      Promise.resolve(6),
    ],
    toAsync,
    map(fetchAsyncError),
    filter((a) => a % 2 === 0),
    concurrent(2), // request 2
    toArray,
  );
} catch (err) {
  // handle err
}
```
