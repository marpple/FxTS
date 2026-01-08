---
description: "FxTSのconcurrentユーティリティで並行非同期操作を処理する方法。"
---

# 並行処理

> `concurrent`は、複数の非同期値を一度に処理できる関数です。

JavaScript には、[Promise.all](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)で複数の promise 値を同時に評価する関数があります。
しかし、同時リクエストの負荷を処理できず、無限の列挙可能なデータセットへのリクエストを処理できません。
[concurrent](/ja/api/concurrent)は、無限データセットの非同期リクエストを処理し、負荷のリクエストサイズを制御できます。

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
  concurrent(3), // この行がないと、合計6秒かかります。
  each(console.log), // 2秒
);
```

1 つずつリクエストすると 6 秒かかりますが、`concurrent`を使用すると 2 秒で完了することがわかります。

### 実用的な例

より実践的なコードは以下の通りです。

<iframe src="https://codesandbox.io/embed/fxts-concurrent-useful-0frg2?fontsize=14&hidenavigation=1&theme=dark"
     style="height:800px; width:100%; border:0; border-radius:4px; overflow:hidden"
     title="fxts-concurrent-useful"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

上記のコードで`concurrent`の位置が以下のようになった場合、結果は変わるでしょうか？
いいえ、同じです！`concurrent`は常に長さが変更される前の`Iterable`に適用されることに注意してください。

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

`map`まで順番に 1 つずつ評価し、
`filter`の非同期 predicate を 3 つ同時に評価したい場合は、以下のコードを記述する必要があります：

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
