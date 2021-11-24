---
id: function-composition
---

# Function Composition

Combinations of `Lazy` functions don't evaluate actual values like [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).
It can be evaluated with a Strict(`toArray`) or [for-of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of), [await for-of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of). Strict functions can be found [here](https://fxts.dev/docs/index#strict)

```ts
import { pipe, range, map, filter, take, toArray } from "@fxts/core";

const nums = pipe(
  range(Infinity),
  map((a) => a * a),
  take(3),
); // not evaluated not yet

const result = pipe(
  nums,
  filter((a) => a % 2 === 0),
  toArray, // Strict function
);
```
