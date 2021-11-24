---
id: to-async
---

# When to use the `toAsync` function?

Many functions in `fxts` can handle both `Iterable` and `AsyncIterable`. For example, the `find` function can be used as follows.

```typescript
const numbers = function* () {
  yield 1;
  yield 2;
  yield 3;
};
const asyncNumbers = async function* () {
  yield 1;
  yield 2;
  yield 3;
};

find((num) => num === 2, numbers()); // 2
find((num) => num === 2, asyncNumbers()); // Promise<2>
```

However, there is a special point to note. `AsyncIterable` can work fine whether the callback function is running synchronously/asynchronously, but You cannot iterate over `Iterable` using asynchronous callback functions or manipulate types `Iterable<Promise<T>>`.

```typescript
const promiseNumbers = function* () {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
  yield Promise.resolve(3);
};

find((num) => Promise.resolve(num === 2), numbers()); // not work
find((num) => num === 2, promiseNumbers()); // not work
```

In order to handle async using `fxts`, the value to iterate must be type of `AsyncIterable`.
If the callback function is asynchronous or should handle `Iterable<Promise<T>>`, use the `toAsync` function to convert it to `AsyncIterable`.

```typescript
await pipe(
  numbers(), // Iterable<number>
  toAsync, // AsyncIterable<number>
  find((num) => Promise.resolve(num === 2)),
);

await pipe(
  promiseNumbers(), // Iterable<Promise<number>>
  toAsync, // AsyncIterable<number>
  find((num) => Promise.resolve(num === 2)),
);
```
