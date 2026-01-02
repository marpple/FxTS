# 函数组合

我们将介绍 [pipe](/zh/api/pipe)。

`pipe` 这个函数已经在几个库中提供，所以你可能很熟悉它。

- [lodash](https://lodash.com/) 中的 flow
- [ramda](https://ramdajs.com/) 中的 pipe
- [rxjs](https://rxjs.dev/) 中的 pipe

`pipe` 是一个通过将函数的输出传递给另一个函数的参数来连接函数的函数。

让我们花一点时间看看为什么需要 `pipe`。

有一个数组，你想对这个数组执行 `filter` -> `map` -> `reduce` 来获得最终结果。

```typescript
const sum = (a: number, b: number) => a + b;
const arr = [1, 2, 3, 4, 5];
// filter
// map
// reduce
```

所有代码都是纯函数，所以创建函数组合很容易，但看起来非常难以阅读。

```typescript
reduce(
  sum,
  map(
    (a) => a + 10,
    filter((a) => a % 2 === 0, arr);
  ),
)
```

我们提供 `pipe` 来解决上述问题。

```typescript
import { filter, map, pipe, reduce } from "@fxts/core";

pipe(
  arr,
  filter((a) => a % 2 === 0),
  map((a) => a + 10),
  reduce(sum),
);
```

与 `pipe` 一起使用时看起来很容易阅读。

> 与 `Array.prototype.[Function]` 的比较请查看[这篇文章](/zh/guide/lazy-evaluation)

<br/>

此外，你不必直接处理 `Promise` 值。

```typescript
await pipe(
  Promise.resolve(1),
  (a /*: Awaited<number>*/) => a + 1,
  async (b /*: Awaited<number>*/) => b + 1,
  (c /*: Awaited<number>*/) => c + 1,
); // 4
```

- a：`a` 被推断为 number，实际值也是 number，而不是 `Promise<number>`。
- c：即使前一个函数是异步函数，参数也不是 `Promise<number>`。

不直接处理异步值并不意味着发生错误时无法处理。
要查看错误处理，请参阅[错误处理](/zh/guide/error-handling)
