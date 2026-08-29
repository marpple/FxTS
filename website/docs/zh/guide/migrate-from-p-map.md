# 从 p-limit / p-map 迁移

如果你使用 `p-map` 或 `p-limit` 对集合施加并发限制来执行异步任务,FxTS 的
`concurrentPool` 可以完成同样的工作 — 并且还提供数组式 mapper 无法表达的流式消费、
提前终止和 AsyncIterable 数据源。

## p-map → concurrentPool

```typescript
// p-map
import pMap from "p-map";
const results = await pMap(urls, (url) => fetchItem(url), { concurrency: 5 });

// FxTS
import { concurrentPool, map, pipe, toArray, toAsync } from "@fxts/core";
const results = await pipe(
  toAsync(urls),
  map((url) => fetchItem(url)),
  concurrentPool(5),
  toArray,
);
```

`concurrentPool` 与 `p-map` 语义相同:一个最多 `n` 个任务同时执行的池,其中一个任务
完成后立即开始下一个,结果按输入顺序返回,第一个失败会中止整个执行。

**迁移时请选择 `concurrentPool` 而不是 `concurrent`。** `concurrent` 以 `n` 个为
单位的固定窗口求值(前一个窗口结束后下一个才开始),需要批处理语义时很有用,但在任务
耗时不均匀的场景下,其吞吐特性与 `p-map` 式的池不同。

## 针对集合的 p-limit → concurrentPool

最常见的 `p-limit` 模式 — 对映射后的集合施加限制 — 也是同样的迁移方式:

```typescript
// p-limit
import pLimit from "p-limit";
const limit = pLimit(5);
const results = await Promise.all(ids.map((id) => limit(() => loadUser(id))));

// FxTS
const results = await pipe(
  toAsync(ids),
  map((id) => loadUser(id)),
  concurrentPool(5),
  toArray,
);
```

## 不对应的部分

坦率地说明边界:

- **共享的 ad-hoc 限流器** — 用一个 `limit` 实例限制代码库中互不相关的调用 — 不是
  管道库所建模的对象。这种用途请继续使用 `p-limit`。
- **`stopOnError: false`**(收集为 `AggregateError`)没有直接对应。FxTS 会传播第一个
  错误。如需收集结果,请在 mapper 中返回结果对象:
  `map(async (url) => fetchItem(url).then((v) => ({ ok: true as const, v }), (e) => ({ ok: false as const, e })))`.
- 不接受 **`AbortSignal`** 选项。惰性求值覆盖了常见场景:停止消费,管道就会停止。

## 相比 p-map 的收益

结果可以**以流的方式消费**,无需等待整个数组:

```typescript
import { concurrentPool, each, map, pipe, toAsync } from "@fxts/core";

await pipe(
  toAsync(urls),
  map((url) => fetchItem(url)),
  concurrentPool(5),
  each((item) => render(item)), // 每个结果到达时按顺序处理
);
```

管道支持**提前终止** — 与 `take` 结合,一旦收集到足够的结果就停止调度后续任务:

```typescript
import {
  concurrentPool,
  filter,
  map,
  pipe,
  take,
  toArray,
  toAsync,
} from "@fxts/core";

const firstThree = await pipe(
  toAsync(candidates),
  map((c) => probe(c)),
  concurrentPool(5),
  filter((r) => r.alive),
  take(3), // 拿到 3 个后停止拉取,剩余任务不会启动
  toArray,
);
```

而且数据源不必是数组 — 任何说 `AsyncIterable` 协议的东西都可以。协议层面的说明请参阅[处理 LLM 令牌流](/zh/guide/llm-streaming):LLM SDK 流、Node.js 流和分页 API 都是数据源。
