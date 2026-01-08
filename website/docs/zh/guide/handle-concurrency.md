---
description: "学习使用FxTS concurrent工具处理并发异步操作的方法。"
---

# 并发处理

> `concurrent` 是一个可以一次处理多个异步值的函数。

在 JavaScript 中，有一个使用 [Promise.all](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 同时评估多个 promise 值的函数。
但是，它无法处理并发请求的负载，也无法处理对无限可枚举数据集的请求。
[concurrent](/zh/api/concurrent) 可以处理无限数据集的异步请求，并可以控制负载的请求大小。

```ts
// prettier-ignore
import { pipe, toAsync, range, map, filter, take, each, concurrent } from "@fxts/core";

const fetchApi = (page) =>
  new Promise((resolve) => setTimeout(() => resolve(page), 1000));

await pipe(
  range(Infinity),
  toAsync,
  map(fetchApi), // 0,1,2,3,4,5
  filter((a) => a % 2 === 0),
  take(3), // 0,2,4
  concurrent(3), // 如果没有这一行，总共需要 6 秒。
  each(console.log), // 2 秒
);
```

你可以看到，一个一个请求需要 6 秒，但使用 `concurrent` 只需要 2 秒。

### 实用示例

更实用的代码如下。

<iframe src="https://codesandbox.io/embed/fxts-concurrent-useful-0frg2?fontsize=14&hidenavigation=1&theme=dark"
     style="height:800px; width:100%; border:0; border-radius:4px; overflow:hidden"
     title="fxts-concurrent-useful"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

如果上面代码中 `concurrent` 的位置如下，结果会不同吗？
不会，是一样的！请注意，`concurrent` 总是在长度改变之前应用于 `Iterable`。

```ts
await pipe(
  range(Infinity),
  toAsync,
  map(fetchApi),
  concurrent(3),
  filter((a) => a % 2 === 0),
  take(3),
  each(console.log),
);
```

如果你想按顺序一个一个评估到 `map`，
并同时评估 `filter` 的三个异步 predicate，你应该编写以下代码：

```ts
await pipe(
  range(Infinity),
  toAsync,
  map(fetchApi),
  toArray,
  filter((a) => delay(100, a % 2 === 0)),
  take(3),
  concurrent(3),
  each(console.log),
);
```
