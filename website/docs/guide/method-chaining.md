# Method Chaining

You can handle Iterable/AsyncIterable through a [pipe](/api/pipe), but `fxts` also provides data change in the form of method chaining.

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

**Note: Since `fx` defaults to lazy evaluation, it is not actually evaluated until strict evaluation methods such as `toArray`, `groupBy`, `indexBy`, and `some` are executed.**

For details on lazy evaluation, please refer to /guide/lazy-evaluation.

### Support for handling AsyncIterable

`fx` can also handle [AsyncIterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator) values. `toAsync` is used in the example below to create an `AsyncIterator` value.

```ts
await fx(toAsync([1, 2, 3, 4]))
  .filter(async (a) => a % 2 === 0)
  .map(async (a) => a * a)
  .reduce(sum);

await fx([1, 2, 3, 4])
  .filter((a) => a % 2 === 0)
  .toAsync() // if async function returns
  .map(async (a) => a * a)
  .reduce(sum);
```

### Handle Concurrency

`fx` supports concurrent operation. As we saw in concurrent, concurrent can only be used in asyncIterable.

For details on handling concurrent with `fxts`, please refer to /guide/handle-concurrency

```ts
/**
 *
 *  evaluation
 *               ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
 *               │  1  │──│  2  │──│  3  │──│  4  │──│  5  │──│  6  │
 *               └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘
 *       map        │        │        │        │        │        │
 *  concurrent(2)  (1)      (1)      (2)      (2)      (3)      (3)
 *                  │        │        │        │        │        │
 *                  ▼        ▼        ▼        ▼        ▼        ▼
 */
await fx(toAsync(range(1, 7)))
  // async function returns
  .map(async (a) => delay(100, a))
  .concurrent(2)
  .consume(); // It takes approximately 300ms.
```

### Etc

`fx` does not provide all the functions of `fxts` as methods.

If you want to use the `fxts` function which is not provided or additional functions, you can use the `chain` method.

```ts
fx([1, 2, 3, 4])
  .chain(append(5))
  .map((a) => a + 10)
  .toArray(); // [11, 12, 13, 14, 15]
```
