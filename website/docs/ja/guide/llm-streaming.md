# LLM トークンストリームの処理

主要な LLM SDK はすべて、ストリームを **AsyncIterable** — 標準の JavaScript
イテレーションプロトコル — として返します。FxTS はまさにそのプロトコル
(Iterable/AsyncIterable)の上に直接構築されたライブラリなので、LLM 出力の
パイプライン層として自然に噛み合います。アダプターもラッパーも不要 — SDK の
ストリームがそのまま FxTS のソースです。

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

// ストリームは AsyncIterable プロトコルを話します - pipe がそのまま消費します
await pipe(
  stream,
  filter((event) => event.type === "content_block_delta"),
  map((event) => ("text" in event.delta ? event.delta.text : "")),
  each((text) => process.stdout.write(text)),
);
```

`filter` は明示的な型ガードなしにイベントのユニオン型を絞り込みます —
TypeScript 5.5+ では述語が自動推論されるため、`map` は
`content_block_delta` イベントのみを受け取ります。

## 十分に得られたら生成処理も止める

遅延評価では、いつ取得をやめるかをダウンストリームが決めます。意味のある境界で
処理を打ち切れば、ストリームの残りはそもそも消費されません:

```typescript
import { filter, map, pipe, takeUntilInclusive, toArray } from "@fxts/core";

// 回答の最初の段落だけを収集
const firstParagraph = await pipe(
  stream,
  filter((event) => event.type === "content_block_delta"),
  map((event) => ("text" in event.delta ? event.delta.text : "")),
  takeUntilInclusive((text) => text.includes("\n\n")),
  toArray,
).then((chunks) => chunks.join("").split("\n\n")[0]);
```

## 制限付きプールでプロンプトをファンアウト

レートリミットの下では無制限の `Promise.all` は悪手です。`concurrentPool` は
最大 `n` 個のリクエストのみを同時に保ち、1 つが完了したらすぐ次を開始し、
結果を入力順で返します:

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
  concurrentPool(3), // 同時実行は最大 3 リクエスト、結果は入力順
  toArray,
);
```

パイプラインは早期終了するため、`take` と組み合わせれば十分な結果が揃った時点で
リクエストの*スケジューリング*自体が止まります — 開始されなかった呼び出しは
実行されず、課金もされません。

## 1 つのプロトコル、あらゆるソース

同じパイプラインが、イテレーションプロトコルを話すすべての上で動作します:

- **LLM SDK ストリーム** — OpenAI と Anthropic のストリームは `AsyncIterable`
- **Node.js ストリーム** — `Readable` は `AsyncIterable` を実装
- **Web ストリーム** — モダンランタイムでは `ReadableStream` は async-iterable
- **ページネーション API** — ページングループを async ジェネレーターで包めば、
  結果セット全体が 1 つの遅延シーケンスになります

FxTS は学ぶべき独自のストリーム抽象を発明しません — プラットフォームとすべての
LLM SDK がすでに使っているプロトコルを組み合わせるだけです。

あわせて読む:

- [並行処理](/ja/guide/handle-concurrency) — `concurrent` と `concurrentPool` の詳細
- [p-limit/p-map からの移行](/ja/guide/migrate-from-p-map) — 既存のプール並行コードを FxTS へ移す
