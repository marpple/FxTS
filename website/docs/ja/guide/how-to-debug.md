---
description: "FxTS関数型パイプラインのデバッグのためのヒントとテクニック。"
---

# パイプラインで簡単にデバッグする方法

## 即時評価

即時評価されるパイプラインでは、`tap`関数を使用してパイプラインの途中で値の変化を追跡できます。
`tap`関数についてもっと知りたい場合は、[こちら](/ja/api/tap)を参照してください。

```typescript
pipe(
  "2021/11/25",
  (str) => str.split("/"),
  tap((a) => console.log(a)), // ['2021', '11', '25']
  (date) => date.map(Number),
  tap((a) => console.log(a)), // [2021, 11, 25]
  (date) => date.map((n) => (n === 1 ? 1 : n - 1)),
  tap((a) => console.log(a)), // [2020, 10, 24]
  (date) => new Date(...date),
);
```

## 遅延評価

以下のコードは、2000 年 1 月 1 日から始まる 13 日の金曜日のリストを作成します。パイプライン内の各関数は`IterableIterator`を返し、これは`toArray`関数が`iterable`を反復処理して値を評価するまで何も起こらないことを意味します。

```typescript
const addDate = (from: Date, n: number) => {
  const clone = new Date(from);
  clone.setDate(n);
  return clone;
};
const addDateFrom = (from: Date) => (n: number) => addDate(from, n);
const is13thOfFriday = (date: Date) =>
  date.getDate() === 13 && date.getDay() === 5;
const formatYYYYMMDD = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

pipe(
  range(1, Infinity),
  map(addDateFrom(new Date(2000, 0, 1))),
  filter(is13thOfFriday),
  map(formatYYYYMMDD),
  take(5),
  toArray,
  console.log,
);
// ['2000-10-13', '2001-4-13', '2001-7-13', '2002-9-13', '2002-12-13']
```

したがって、`tap`関数を使用してパイプラインの途中でログを出力しても、実際の評価プロセスを追跡するのは難しいです。おそらく値の型が`IterableIterator`であることだけがわかるでしょう。

```typescript
pipe(
  range(1, Infinity),
  map(addDateFrom(new Date(2000, 0, 1))),
  filter(is13thOfFriday),
  tap(console.log), // IterableIterator
  map(formatYYYYMMDD),
  tap(console.log), // IterableIterator
  take(5),
  toArray,
);
```

この遅延評価の進行状況を追跡したい場合は、[peek](/ja/api/peek)関数を使用できます。

```typescript
pipe(
  range(1, Infinity),
  map(addDateFrom(new Date(2000, 0, 1))),
  filter(is13thOfFriday),
  peek(console.log),
  map(formatYYYYMMDD),
  peek(console.log),
  take(5),
  toArray,
);
```

[完全なコードはこちらです。](https://codesandbox.io/s/how-to-debug-t2tmb?file=/src/index.ts)

FxTS の遅延評価を確認するには、[遅延評価](/ja/guide/lazy-evaluation)を参照してください。
