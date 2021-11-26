---
id: function-composition
---

# Function Composition

We are going to introduce [pipe](https://fxts.dev/docs/pipe).

A function named `pipe` is already provided by several libraries, so you may be familiar with it.

- flow in [lodash](https://lodash.com/)
- pipe in [ramda](https://ramdajs.com/)
- pipe in [rxjs](https://rxjs.dev/).

`pipe` is a function that connects functions by passing the output of a function to the arguments of another function.

Let's take a moment to see why we need `pipe`.

There is an array, and you want to get the final result by doing `filter` -> `map` -> `reduce` on this array.

```typescript
const sum = (a: number, b: number) => a + b;
const arr = [1, 2, 3, 4, 5];
// filter
// map
// reduce
```

All of the code is pure functions, so it's easy to create a function composition, but it seems to be very difficult to read.

```typescript
reduce(
  sum,
  map(
    (a) => a + 10,
    filter((a) => a % 2 === 0, arr);
  ),
)
```

We are providing `pipe` to solve the above problem.

```typescript
import { pipe, filter, map, reduce } from "@fxts/core";

pipe(
  arr,
  filter((a) => a % 2 === 0),
  map((a) => a + 10),
  reduce(sum),
);
```

It looks easy to read when used with `pipe`.

> Check out [this article](https://fxts.dev/docs/lazy-evaluation) for a comparison with `Array.prototype.[Function]`

<br/>

Also, you don't have to deal with `Promise` values directly.

```typescript
await pipe(
  Promise.resolve(1),
  (a /*: Awaited<number>*/) => a + 1,
  async (b /*: Awaited<number>*/) => b + 1,
  (c /*: Awaited<number>*/) => c + 1,
); // 4
```

- a : `a` is inferred as number, and the actual value is also number, not `Promise<number>`.
- c : Even if the previous function is an asynchronous function, the argument is not c `Promise<number>`.

If you're not dealing with async values directly, it doesn't mean that errors can not be handled when occur.
To check for error handling, see the [Error Handling](https://fxts.dev/docs/error-handling)
