---
description: "FxTSで非同期イテラブルを処理するためにtoAsyncを使用するタイミングと方法。"
---

# `toAsync`関数はいつ使うべきですか？

FxTS の多くの関数は、`Iterable`と`AsyncIterable`の両方を処理できます。例えば、`find`関数は次のように使用できます。

```typescript
const numbers = function* () {
  yield 1;
  yield 2;
  yield 3;
};

const asyncNumbers = async function* () {
  yield 1;
  yield 2;
  yield 3;
};

find((num) => num === 2, numbers()); // 2
find((num) => num === 2, asyncNumbers()); // Promise<2>
```

特に注意すべき点があります。`AsyncIterable`はコールバック関数が同期/非同期で実行されても問題なく動作しますが、
**非同期コールバック関数を使用して`Iterable`を反復処理したり、`Iterable<Promise<T>>`型を操作したりすることはできません。**

```typescript
const promiseNumbers = function* () {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
  yield Promise.resolve(3);
};

find((num) => Promise.resolve(num === 2), numbers()); // 動作しません
find((num) => num === 2, promiseNumbers()); // 動作しません
```

FxTS を使用して非同期を処理するには、反復処理する値が`AsyncIterable`型である必要があります。
コールバック関数が非同期である場合、または`Iterable<Promise<T>>`を処理する必要がある場合は、`toAsync`関数を使用して`AsyncIterable`に変換してください。

```typescript
await pipe(
  numbers(), // Iterable<number>
  toAsync, // AsyncIterable<number>
  find((num) => Promise.resolve(num === 2)),
);

await pipe(
  promiseNumbers(), // Iterable<Promise<number>>
  toAsync, // AsyncIterable<number>
  find((num) => Promise.resolve(num === 2)),
);
```
