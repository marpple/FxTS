---
description: "理解FxTS中的惰性求值，高效处理大型或无限数据集。"
---

# 惰性求值

FxTS 提供[惰性求值](https://zh.wikipedia.org/wiki/%E6%83%B0%E6%80%A7%E6%B1%82%E5%80%BC)。
让我通过代码解释为什么惰性求值是有用的。

我们经常看到如下代码。通过声明式地编写代码，我们希望创建可维护且易于阅读的代码。

```ts
const sum = (a: number, b: number) => a + b;

[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .filter((a) => a % 2 === 0)
  .map((a) => a * a)
  .reduce(sum);
```

看起来非常易读。现在让我们看看它是如何工作的。

为了将其视为[不可变](https://zh.wikipedia.org/wiki/%E4%B8%8D%E5%8F%AF%E8%AE%8A%E7%89%A9%E4%BB%B6)的，每次方法执行时，
都会创建一个新大小的数组并遍历该数组。

```typescript
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .filter((a) => a % 2 === 0) // [0, 2, 4, 6, 8]
  .map((a) => a * a) // [0, 4, 16, 36, 64]
  .reduce(sum); // 120
```

因为它会遍历所有数组值，
像 `slice` 和 `filter` 这样减少数组大小的逻辑通常放在前面
（这样可以减少遍历次数）。

```typescript
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .filter((a) => a % 2 === 0) // [0, 2, 4, 6, 8]
  .slice(0, 2); // [0, 2]
  .map((a) => a * a) // [0, 4]
  .reduce(sum); // 4
```

目前，数组大小非常小，所以看起来没有问题。
但是如果大小变得非常大，我们是否必须回到命令式编程？

FxTS 可以作为处理 `Iterable`/`AsyncIterable` 的函数组合使用，
在这种情况下，它只在需要时才评估 `Iterable`/`AsyncIterable` 中的值。

`take(2)`（只有 2 个值）被评估，之后不再评估更多值。
此外，上面的代码 `Array.prototype.filter` 需要遍历所有值，
而下面的代码只评估它需要的值。甚至 `filter` 也是如此。

```typescript
pipe(
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  filter((a) => a % 2 === 0), // [0, 2]
  map((a) => a * a), // [0, 4]
  take(2), // [0, 4]
  reduce(sum), // 4
);
```

FxTS 是表示大型或可能无限的可枚举数据集的有用方式。

```typescript
pipe(
  range(Infinity),
  filter((a) => a % 2 === 0), // [0, 2]
  map((a) => a * a), // [0, 4]
  take(2), // [0, 4]
  reduce(sum), // 4
);
```

`Lazy` 函数的组合不会像[生成器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator)那样评估实际值。
它可以用 [for-of](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of) 或
[await for-of](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for-await...of)、
`Strict` 函数来评估。`Strict` 函数可以在[这里](https://fxts.dev/api#strict)找到。

```typescript
const squareNums = pipe(
  range(Infinity),
  map((a) => a * a),
); // 尚未评估

const result = pipe(
  squareNums,
  filter((a) => a % 2 === 0),
  take(10),
  toArray, // Strict 函数
);
```

Lazy 函数可以在[这里](https://fxts.dev/api#lazy)找到。

### 实用示例

下面的代码展示了一个更有用的情况。

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
