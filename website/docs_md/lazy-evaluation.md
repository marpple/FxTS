---
id: lazy-evaluation
---

# Lazy Evaluation

FxTS provides [lazy evaluation](https://en.wikipedia.org/wiki/Lazy_evaluation).
Let me explain through code why lazy evaluation is useful.

We often see code like the one below. By writing code declaratively, we want to make code that is maintainable and easy to read.

```ts
const sum = (a: number, b: number) => a + b;

[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .filter((a) => a % 2 === 0)
  .map((a) => a * a)
  .reduce(sum);
```

It looks very readable. Now let's see how it works.

To treat it as [immutable](https://en.wikipedia.org/wiki/Immutable_object), each time the method proceeds,
an array of a new size is created and the array is traversed.

```typescript
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .filter((a) => a % 2 === 0) // [0, 2, 4, 6, 8]
  .map((a) => a * a) // [0, 4, 16, 36, 64]
  .reduce(sum); // 120
```

Because it iterates through all the array values,
the logic that reduces the size of the array, such as `slice` and `filter`, is usually placed in front of the logic
(That way you can have fewer traversals).

```typescript
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .filter((a) => a % 2 === 0) // [0, 2, 4, 6, 8]
  .slice(0, 2); // [0, 2]
  .map((a) => a * a) // [0, 4]
  .reduce(sum); // 4
```

Currently, the size of array is very small, so it doesn't seem like a problem.
But if the size gets really big, do we have to go back to imperative programming?

FxTS can be used as a combination of functions that deal with `Iterable`/`AsyncIterble`,
in which case it evaluates the value from the `Iterable`/`AsyncIterable` only as needed.

`take(2)`(only 2 values) are evaluated and no further values are evaluated after that.
In addition, the above code `Array.prototype.filter` needs to traverse all values,
while the code below only evaluates the values it needs. Even the `filter`.

```typescript
pipe(
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  filter((a) => a % 2 === 0), // [0, 2]
  map((a) => a * a), // [0, 4]
  take(2), // [0, 4]
  reduce(sum), // 4
);
```

FxTS are a useful way to represent large or possibly infinite enumerable data sets

```typescript
pipe(
  range(Infinity),
  filter((a) => a % 2 === 0), // [0, 2]
  map((a) => a * a), // [0, 4]
  take(2), // [0, 4]
  reduce(sum), // 4
);
```

Combinations of `Lazy` functions don't evaluate actual values like [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).
It can be evaluated with a [for-of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) or
[await for-of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of),
`Strict` functions. `Strict` functions can be found [here](https://fxts.dev/docs/index#strict)

```typescript
const squareNums = pipe(
  range(Infinity),
  map((a) => a * a),
); // not evaluated not yet

const result = pipe(
  squareNums,
  filter((a) => a % 2 === 0),
  take(10),
  toArray, // Strict function
);
```

Lazy functions can be found [here](https://fxts.dev/docs/index#lazy)

### Useful Example

The code below shows a more useful situation.

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
