# メソッドチェーン

[pipe](/ja/api/pipe)で Iterable/AsyncIterable を処理できますが、`fxts`はメソッドチェーン形式でのデータ変換も提供しています。

```ts
fx([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  .filter((a) => a % 2 === 0) // [0, 2]
  .map((a) => a * a) // [0, 4]
  .take(2) // [0, 4]
  .reduce(sum); // 4

fx("abc")
  .map((a) => a.toUpperCase()) // ["A", "B"]
  .take(2)
  .toArray(); // ["A", "B"]
```

**注意: `fx`はデフォルトで遅延評価を使用するため、`toArray`、`groupBy`、`indexBy`、`some`などの即時評価メソッドが実行されるまで実際には評価されません。**

遅延評価の詳細については、/ja/guide/lazy-evaluation を参照してください。

### AsyncIterable の処理サポート

`fx`は[AsyncIterator](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator)値も処理できます。以下の例では、`toAsync`を使用して`AsyncIterator`値を作成しています。

```ts
await fx(toAsync([1, 2, 3, 4]))
  .filter(async (a) => a % 2 === 0)
  .map(async (a) => a * a)
  .reduce(sum);

await fx([1, 2, 3, 4])
  .filter((a) => a % 2 === 0)
  .toAsync() // 非同期関数が返される場合
  .map(async (a) => a * a)
  .reduce(sum);
```

### 並行処理

`fx`は並行操作をサポートしています。concurrent で見たように、concurrent は asyncIterable でのみ使用できます。

`fxts`での並行処理の詳細については、/ja/api/handle-concurrency を参照してください。

```ts
/**
 *
 *  評価
 *               ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
 *               │  1  │──│  2  │──│  3  │──│  4  │──│  5  │──│  6  │
 *               └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘
 *       map        │        │        │        │        │        │
 *  concurrent(2)  (1)      (1)      (2)      (2)      (3)      (3)
 *                  │        │        │        │        │        │
 *                  ▼        ▼        ▼        ▼        ▼        ▼
 */
await fx(toAsync(range(1, 7)))
  // 非同期関数の戻り値
  .map(async (a) => delay(100, a))
  .concurrent(2)
  .consume(); // 約300msかかります。
```

### その他

`fx`は`fxts`のすべての関数をメソッドとして提供しているわけではありません。

提供されていない`fxts`関数や追加関数を使用したい場合は、`chain`メソッドを使用できます。

```ts
fx([1, 2, 3, 4])
  .chain(append(5))
  .map((a) => a + 10)
  .toArray(); // [11, 12, 13, 14, 15]
```
