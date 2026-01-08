---
description: "FxTS関数型ユーティリティを使用する際のエラー処理パターンとベストプラクティス。"
---

# エラー処理

エラー処理は、すべてのプログラミングで不可欠な部分です。

他のライブラリとは異なり、FxTS のエラー処理は特定のエラー処理方法を知る必要がありません。
FxTS は標準プロトコルに従っているため、`try-catch`で簡単にエラーを処理できます。
これは同期/非同期エラーの伝播が可能であることを意味するため、
[sentry](https://sentry.io/)やさまざまなサードパーティのエラーロギングおよびデバッグツールと一緒に使用するのに適しています。

### 同期エラー処理

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
  // エラー処理
}
```

### 非同期エラー処理

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
  // エラー処理
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
  // エラー処理
}
```

### 並行エラー処理（Concurrent を使用）

同時リクエスト状態では、以前にエラーが発生しても`concurrent`リクエスト数だけ`AsyncIterable`が評価されます。
これは[Promise.all](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)で非同期リクエストを実行する場合と同じです。
`Promise.all`は 1 つが失敗してもすべて実行されます。

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
      Promise.resolve(3), // この項目が評価されると、`map`関数がエラーをスローします。
      Promise.resolve(4), // この項目も評価されます。
      Promise.resolve(5), // この項目からは評価されません。
      Promise.resolve(6),
    ],
    toAsync,
    map(fetchAsyncError),
    filter((a) => a % 2 === 0),
    concurrent(2), // 2つずつリクエスト
    toArray,
  );
} catch (err) {
  // エラー処理
}
```
