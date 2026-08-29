# 处理 LLM 令牌流

所有主流 LLM SDK 都以 **AsyncIterable** — 标准 JavaScript 迭代协议 — 的形式返回
流。FxTS 正是直接构建在这个协议(Iterable/AsyncIterable)之上的库,因此它是 LLM
输出的天然管道层:不需要适配器,不需要包装 — SDK 的流本身就是 FxTS 的数据源。

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { each, filter, map, pipe } from "@fxts/core";

const client = new Anthropic();

const stream = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Write a haiku about iterators" }],
  stream: true,
});

// 流说的是 AsyncIterable 协议 - pipe 直接消费它
await pipe(
  stream,
  filter((event) => event.type === "content_block_delta"),
  map((event) => ("text" in event.delta ? event.delta.text : "")),
  each((text) => process.stdout.write(text)),
);
```

`filter` 无需显式类型守卫即可收窄事件联合类型 — 在 TypeScript 5.5+ 中谓词会被
自动推断,因此 `map` 只会接收 `content_block_delta` 事件。

## 拿到足够的结果就停止生成工作

惰性求值意味着由下游决定何时停止拉取。在语义边界处截断处理,流的剩余部分根本
不会被消费:

```typescript
import { filter, map, pipe, takeUntilInclusive, toArray } from "@fxts/core";

// 只收集回答的第一段
const firstParagraph = await pipe(
  stream,
  filter((event) => event.type === "content_block_delta"),
  map((event) => ("text" in event.delta ? event.delta.text : "")),
  takeUntilInclusive((text) => text.includes("\n\n")),
  toArray,
).then((chunks) => chunks.join("").split("\n\n")[0]);
```

## 用有界池扇出提示词

在速率限制之下,无限制的 `Promise.all` 是坏主意。`concurrentPool` 最多保持 `n`
个请求同时进行,一个完成后立即开始下一个,并按输入顺序产出结果:

```typescript
import { concurrentPool, map, pipe, toArray, toAsync } from "@fxts/core";

const summarize = async (doc: string): Promise<string> => {
  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 256,
    messages: [{ role: "user", content: `Summarize:\n\n${doc}` }],
  });
  return message.content[0].type === "text" ? message.content[0].text : "";
};

const summaries = await pipe(
  toAsync(documents),
  map(summarize),
  concurrentPool(3), // 最多 3 个请求同时进行,结果按输入顺序
  toArray,
);
```

由于管道支持提前终止,与 `take` 结合后,一旦拿到足够的结果就会停止*调度*请求 —
未开始的调用永远不会发出,也永远不会计费。

## 一个协议,所有数据源

同样的管道适用于一切说迭代协议的东西:

- **LLM SDK 流** — OpenAI 和 Anthropic 的流都是 `AsyncIterable`
- **Node.js 流** — `Readable` 实现了 `AsyncIterable`
- **Web 流** — 现代运行时中 `ReadableStream` 是 async-iterable
- **分页 API** — 把分页循环包进 async 生成器,整个结果集就成为一个惰性序列

FxTS 不发明需要额外学习的流抽象 — 它只是组合平台和所有 LLM SDK 已经在用的那个
协议。
