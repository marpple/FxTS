# p-limit / p-map からの移行

コレクションに同時実行数の制限をかけて非同期処理を実行するために `p-map` や
`p-limit` を使っているなら、FxTS の `concurrentPool` が同じ役割を果たします —
さらに、配列ベースのマッパーでは表現できないストリーミング、早期終了、
AsyncIterable ソースも得られます。

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

`concurrentPool` は `p-map` と同じセマンティクスです: 最大 `n` 個のタスクが実行中の
プールで、1 つが完了するとすぐ次のタスクが開始され、結果は入力順で返り、最初の失敗が
実行を中断します。

**移行の際は `concurrent` ではなく `concurrentPool` を選んでください。**
`concurrent` は `n` 個単位の固定ウィンドウで評価します(前のウィンドウが終わってから
次が始まる)。バッチのセマンティクスが必要な場合には有用ですが、処理時間が不均一な
ワークロードでは `p-map` 方式のプールとスループット特性が異なります。

## 実測

同じプールセマンティクスなら、実際の所要時間も同じはずです。公開パッケージでの実測です(5 回実行の中央値、Node 24、`@fxts/core` 2.0.1 vs `p-map` 7):

| シナリオ                               | p-map | `concurrentPool` | `concurrent` |
| -------------------------------------- | ----- | ---------------- | ------------ |
| 不均一な所要時間(6 タスク、並行数 2)   | 455ms | 455ms            | 654ms        |
| 均一 50 × 50ms、並行数 5               | 510ms | 511ms            | 511ms        |
| resolve 済みタスク 5,000 件、並行数 10 | 4ms   | 9ms              | 2ms          |

移行はパフォーマンスのトレードオフではありません: 並行数リミッターの存在理由である I/O バウンドのワークロードでは、`concurrentPool` は p-map と同等です。最後の行は正直な注記です — no-op タスクではプールの順序保持の管理コストが 1 件あたり約 1 マイクロ秒余分にかかりますが、タスクが実際の処理を行った瞬間に消える規模です。`concurrent` 列は上で説明したウィンドウ動作を示しています。

## コレクションに対する p-limit → concurrentPool

最も一般的な `p-limit` パターン — マッピングされたコレクションへの制限 — も同じ
方法で移行できます:

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

## 対応しないもの

境界を正直に述べると:

- **共有される ad-hoc リミッター** — 1 つの `limit` インスタンスでコードベース各所の
  無関係な呼び出しを制限するパターン — はパイプラインライブラリがモデル化する対象では
  ありません。その用途には `p-limit` を使い続けてください。
- **`stopOnError: false`**(`AggregateError` への収集)の直接の対応物はありません。
  FxTS は最初のエラーを伝播します。結果を収集したい場合はマッパーで結果オブジェクトを
  返してください:
  `map(async (url) => fetchItem(url).then((v) => ({ ok: true as const, v }), (e) => ({ ok: false as const, e })))`.
- **`AbortSignal`** オプションはありません。一般的なケースは遅延評価がカバーします:
  消費を止めればパイプラインも止まります。

## p-map に対して得られるもの

配列全体を待たずに、結果を**ストリームとして消費**できます:

```typescript
import { concurrentPool, each, map, pipe, toAsync } from "@fxts/core";

await pipe(
  toAsync(urls),
  map((url) => fetchItem(url)),
  concurrentPool(5),
  each((item) => render(item)), // 結果が届くたびに、順序どおりに処理
);
```

パイプラインは**早期終了**します — `take` と組み合わせれば、十分な数が揃った時点で
タスクのスケジューリング自体が止まります:

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
  take(3), // 3 つ得られたら取得を止め、残りの処理は開始されません
  toArray,
);
```

そしてソースは配列である必要はありません — `AsyncIterable` プロトコルを話すものなら何でも動作します。プロトコル観点の解説は [LLM トークンストリームの処理](/ja/guide/llm-streaming) を参照してください: LLM SDK ストリーム、Node.js ストリーム、ページネーション API はすべてソースになります。
