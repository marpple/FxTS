# 错误处理

错误处理是任何编程中必不可少的部分。

与其他库不同，FxTS 中的错误处理不需要了解特定的错误处理部分。
由于 FxTS 遵循标准协议，你可以使用 `try-catch` 轻松处理错误。
这意味着同步/异步错误传播是可能的，
因此非常适合与 [sentry](https://sentry.io/) 或各种第三方错误记录和调试工具一起使用。

### 同步错误处理

```typescript
import { map, pipe, take, toArray, toAsync } from "@fxts/core";

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
  // 处理错误
}
```

### 异步错误处理

```typescript
import { filter, map, pipe, toArray, toAsync } from "@fxts/core";

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
  // 处理错误
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
  // 处理错误
}
```

### 并发错误处理（使用 Concurrent）

在并发请求状态下，即使之前发生了错误，`AsyncIterable` 也会被评估与 `concurrent` 请求数一样多。
这与使用 [Promise.all](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 执行异步请求的情况相同，
`Promise.all` 即使一个失败也会全部执行。

```typescript
import { concurrent, filter, map, pipe, toArray, toAsync } from "@fxts/core";

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
      Promise.resolve(3), // 当此项被评估时，`map` 函数抛出错误。
      Promise.resolve(4), // 此项也会被评估。
      Promise.resolve(5), // 从此项开始不再评估。
      Promise.resolve(6),
    ],
    toAsync,
    map(fetchAsyncError),
    filter((a) => a % 2 === 0),
    concurrent(2), // 每次请求 2 个
    toArray,
  );
} catch (err) {
  // 处理错误
}
```
