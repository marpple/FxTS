# 如何在管道中轻松调试？

## 即时评估

在即时评估的管道中，你可以使用 `tap` 函数在管道中间跟踪值的变化。
如果你想了解更多关于 `tap` 函数的信息，请参阅[这里](/zh/api/tap)。

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

## 惰性求值

下面的代码创建一个从 2000 年 1 月 1 日开始的 13 号星期五列表。管道中的每个函数返回一个 `IterableIterator`，这意味着在 `toArray` 函数迭代 `iterable` 并评估值之前什么都不会发生。

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

因此，即使在管道中间使用 `tap` 函数记录日志，也很难跟踪实际的评估过程。也许你只会知道值的类型是 `IterableIterator`。

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

如果你想跟踪这个惰性求值的进度，可以使用 [peek](/zh/api/peek) 函数。

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

[完整代码在这里。](https://codesandbox.io/s/how-to-debug-t2tmb?file=/src/index.ts)

要了解 FxTS 中的惰性求值，请参阅[惰性求值](/zh/guide/lazy-evaluation)
