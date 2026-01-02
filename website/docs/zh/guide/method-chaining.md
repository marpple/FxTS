# 方法链

你可以通过 [pipe](/api/pipe) 处理 Iterable/AsyncIterable，但 `fxts` 也提供方法链形式的数据转换。

```ts
fx([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  .filter((a) => a % 2 === 0) // [0, 2]
  .map((a) => a * a) // [0, 4]
  .take(2) // [0, 4]
  .reduce(sum); // 4

fx("abc")
  .map((a) => a.toUpperCase()) // ["A", "B"]
  .take(2)
  .toArray(); // ["A", "B"]
```

**注意：由于 `fx` 默认使用惰性求值，所以在执行 `toArray`、`groupBy`、`indexBy`、`some` 等即时评估方法之前，实际上不会进行评估。**

有关惰性求值的详细信息，请参阅 /api/lazy-evaluation。

### 支持处理 AsyncIterable

`fx` 也可以处理 [AsyncIterator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator) 值。下面的示例使用 `toAsync` 创建 `AsyncIterator` 值。

```ts
await fx(toAsync([1, 2, 3, 4]))
  .filter(async (a) => a % 2 === 0)
  .map(async (a) => a * a)
  .reduce(sum);

await fx([1, 2, 3, 4])
  .filter((a) => a % 2 === 0)
  .toAsync() // 如果返回异步函数
  .map(async (a) => a * a)
  .reduce(sum);
```

### 并发处理

`fx` 支持并发操作。正如我们在 concurrent 中看到的，concurrent 只能在 asyncIterable 中使用。

有关使用 `fxts` 处理并发的详细信息，请参阅 /api/handle-concurrency

```ts
/**
 *
 *  评估
 *               ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
 *               │  1  │──│  2  │──│  3  │──│  4  │──│  5  │──│  6  │
 *               └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘
 *       map        │        │        │        │        │        │
 *  concurrent(2)  (1)      (1)      (2)      (2)      (3)      (3)
 *                  │        │        │        │        │        │
 *                  ▼        ▼        ▼        ▼        ▼        ▼
 */
await fx(toAsync(range(1, 7)))
  // 异步函数返回
  .map(async (a) => delay(100, a))
  .concurrent(2)
  .consume(); // 大约需要 300ms。
```

### 其他

`fx` 并不将 `fxts` 的所有函数都作为方法提供。

如果你想使用未提供的 `fxts` 函数或额外函数，可以使用 `chain` 方法。

```ts
fx([1, 2, 3, 4])
  .chain(append(5))
  .map((a) => a + 10)
  .toArray(); // [11, 12, 13, 14, 15]
```
