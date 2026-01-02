# 関数合成

[pipe](/ja/api/pipe)について紹介します。

`pipe`という関数は、すでにいくつかのライブラリで提供されているので、馴染みがあるかもしれません。

- [lodash](https://lodash.com/)の flow
- [ramda](https://ramdajs.com/)の pipe
- [rxjs](https://rxjs.dev/)の pipe

`pipe`は、関数の出力を別の関数の引数に渡すことで、関数をつなげる関数です。

`pipe`がなぜ必要なのか、少し見てみましょう。

配列があり、この配列に`filter` -> `map` -> `reduce`を実行して最終結果を得たいとします。

```typescript
const sum = (a: number, b: number) => a + b;
const arr = [1, 2, 3, 4, 5];
// filter
// map
// reduce
```

すべてのコードが純粋関数なので、関数合成を作成するのは簡単ですが、非常に読みにくく見えます。

```typescript
reduce(
  sum,
  map(
    (a) => a + 10,
    filter((a) => a % 2 === 0, arr);
  ),
)
```

上記の問題を解決するために、`pipe`を提供しています。

```typescript
import { filter, map, pipe, reduce } from "@fxts/core";

pipe(
  arr,
  filter((a) => a % 2 === 0),
  map((a) => a + 10),
  reduce(sum),
);
```

`pipe`と一緒に使うと読みやすくなります。

> `Array.prototype.[Function]`との比較については、[この記事](/ja/guide/lazy-evaluation)を確認してください。

<br/>

また、`Promise`の値を直接扱う必要がありません。

```typescript
await pipe(
  Promise.resolve(1),
  (a /*: Awaited<number>*/) => a + 1,
  async (b /*: Awaited<number>*/) => b + 1,
  (c /*: Awaited<number>*/) => c + 1,
); // 4
```

- a : `a`は number として推論され、実際の値も`Promise<number>`ではなく number です。
- c : 前の関数が非同期関数でも、引数は`Promise<number>`ではありません。

非同期値を直接扱わなくても、エラー発生時に処理できないわけではありません。
エラー処理については、[エラー処理](/ja/guide/error-handling)を確認してください。
