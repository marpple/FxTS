---
id: how-to-debug
---

# How to debug in pipeline easily?

## Strict evaluation

In strictly-evaluated pipeline, you can track changing of the value in the middle of the pipeline by using the `tap` function.
If you want to know more about the `tap` function, see [here](https://fxts.dev/docs/tap).

```typescript
pipe(
  "2021/11/25",
  (str) => str.split("/"),
  tap((a) => console.log(a)), // ['2021', '11', '25']
  (date) => date.map(Number),
  tap((a) => console.log(a)), // [2021, 11, 25]
  (date) => date.map((n) => (n === 1 ? 1 : n - 1)),
  tap((a) => console.log(a)), // [2020, 10, 24]
  (date) => new Date(...date),
);
```

## Lazy evaluation

The code below creates a list of the 13th of Fridays, starting from January 1, 2000. Each function in the pipeline returns an `IterableIterator`, Which means nothing happens until the `toArray` function iterates through the `iterable` and evaluates the value.

```typescript
const addDate = (from: Date, n: number) => {
  const clone = new Date(from);
  clone.setDate(n);
  return clone;
};
const addDateFrom = (from: Date) => (n: number) => addDate(from, n);
const is13thOfFriday = (date: Date) =>
  date.getDate() === 13 && date.getDay() === 5;
const formatYYYYMMDD = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

pipe(
  range(1, Infinity),
  map(addDateFrom(new Date(2000, 0, 1))),
  filter(is13thOfFriday),
  map(formatYYYYMMDD),
  take(5),
  toArray,
  console.log,
);
// ['2000-10-13', '2001-4-13', '2001-7-13', '2002-9-13', '2002-12-13']
```

Therefore, even if the logs are in the middle of the pipeline using the `tap` function, It is hard to trace the actual evaluation process. Maybe you will only know that type of value is `IterableIterator`.

```typescript
pipe(
  range(1, Infinity),
  map(addDateFrom(new Date(2000, 0, 1))),
  filter(is13thOfFriday),
  tap(console.log), // IterableIterator
  map(formatYYYYMMDD),
  tap(console.log), // IterableIterator
  take(5),
  toArray,
);
```

If you want to track the progress of this lazy evaluation, you can use the [peek](https://fxts.dev/docs/peek) function.

```typescript
pipe(
  range(1, Infinity),
  map(addDateFrom(new Date(2000, 0, 1))),
  filter(is13thOfFriday),
  peek(console.log),
  map(formatYYYYMMDD),
  peek(console.log),
  take(5),
  toArray,
);
```

[The entire code is here.](https://codesandbox.io/s/how-to-debug-t2tmb?file=/src/index.ts)

To check for lazy evaluation in FxTS, see the [Lazy evaluation](https://fxts.dev/docs/lazy-evaluation)
