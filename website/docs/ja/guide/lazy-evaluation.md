---
description: "FxTSの遅延評価を理解し、大規模または無限のデータセットを効率的に処理する方法。"
---

# 遅延評価

FxTS は[遅延評価](https://ja.wikipedia.org/wiki/%E9%81%85%E5%BB%B6%E8%A9%95%E4%BE%A1)を提供します。
コードを通じて遅延評価がなぜ有用なのかを説明します。

以下のようなコードをよく見かけます。宣言的にコードを書くことで、保守しやすく読みやすいコードを作りたいと考えています。

```ts
const sum = (a: number, b: number) => a + b;

[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .filter((a) => a % 2 === 0)
  .map((a) => a * a)
  .reduce(sum);
```

非常に読みやすく見えます。では、どのように動作するか見てみましょう。

[イミュータブル](https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%9F%E3%83%A5%E3%83%BC%E3%82%BF%E3%83%96%E3%83%AB)として扱うために、メソッドが進むたびに
新しいサイズの配列が作成され、配列が走査されます。

```typescript
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .filter((a) => a % 2 === 0) // [0, 2, 4, 6, 8]
  .map((a) => a * a) // [0, 4, 16, 36, 64]
  .reduce(sum); // 120
```

すべての配列値を走査するため、
`slice`や`filter`のように配列サイズを縮小するロジックは通常前に配置します
（そうすることで走査回数を減らせます）。

```typescript
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .filter((a) => a % 2 === 0) // [0, 2, 4, 6, 8]
  .slice(0, 2); // [0, 2]
  .map((a) => a * a) // [0, 4]
  .reduce(sum); // 4
```

現在、配列サイズが非常に小さいので問題ないように見えます。
しかし、サイズが本当に大きくなった場合、命令型プログラミングに戻る必要があるのでしょうか？

FxTS は`Iterable`/`AsyncIterable`を扱う関数の組み合わせとして使用でき、
この場合、`Iterable`/`AsyncIterable`の値を必要な分だけ評価します。

`take(2)`（2 つの値のみ）が評価され、それ以降の値は評価されません。
また、上記のコードの`Array.prototype.filter`はすべての値を走査する必要がありますが、
以下のコードは必要な値のみを評価します。`filter`さえも。

```typescript
pipe(
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  filter((a) => a % 2 === 0), // [0, 2]
  map((a) => a * a), // [0, 4]
  take(2), // [0, 4]
  reduce(sum), // 4
);
```

FxTS は、大規模または無限の列挙可能なデータセットを表現するのに便利な方法です。

```typescript
pipe(
  range(Infinity),
  filter((a) => a % 2 === 0), // [0, 2]
  map((a) => a * a), // [0, 4]
  take(2), // [0, 4]
  reduce(sum), // 4
);
```

`Lazy`関数の組み合わせは、[ジェネレーター](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Generator)のように実際の値を評価しません。
[for-of](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for...of)や
[await for-of](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for-await...of)、
`Strict`関数で評価できます。`Strict`関数は[こちら](https://fxts.dev/api#strict)で確認できます。

```typescript
const squareNums = pipe(
  range(Infinity),
  map((a) => a * a),
); // まだ評価されていません

const result = pipe(
  squareNums,
  filter((a) => a % 2 === 0),
  take(10),
  toArray, // Strict関数
);
```

Lazy 関数は[こちら](https://fxts.dev/api#lazy)で確認できます。

### 実用的な例

以下のコードは、より実用的な状況を示しています。

```typescript
/**
 * [{
 *   title: string,
 *   director: string,
 *   language: string,
 *   genre: string,
 *   rating: number,
 *   ...
 * }]
 */
const fetchMovie = async (year: number) =>
  fetch(`https://api.movie.xxx/${year}`);

const recommendMovie = async (year: number, rating: number) =>
  pipe(
    range(year, Infinity),
    toAsync,
    map(fetchMovie),
    map((res) => res.json()),
    filter((movie) => movie.rating >= rating),
    head,
  );

await recommendMovie(2020, 9);
```
