# 何时使用 `toAsync` 函数？

FxTS 中的许多函数可以处理 `Iterable` 和 `AsyncIterable`。例如，`find` 函数可以如下使用。

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

有一个特别需要注意的点。`AsyncIterable` 无论回调函数是同步还是异步运行都可以正常工作，
但**你不能使用异步回调函数迭代 `Iterable` 或操作类型 `Iterable<Promise<T>>`。**

```typescript
const promiseNumbers = function* () {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
  yield Promise.resolve(3);
};

find((num) => Promise.resolve(num === 2), numbers()); // 不工作
find((num) => num === 2, promiseNumbers()); // 不工作
```

为了使用 FxTS 处理异步，要迭代的值必须是 `AsyncIterable` 类型。
如果回调函数是异步的或需要处理 `Iterable<Promise<T>>`，请使用 `toAsync` 函数将其转换为 `AsyncIterable`。

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
