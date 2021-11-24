---
id: lazy-evaluation
---

# Lazy Evaluation

We provide [lazy evaluation](https://en.wikipedia.org/wiki/Lazy_evaluation).

```ts
import { pipe, peek, range, map, filter, take, toArray } from "@fxts/core";

pipe(
  range(100),
  peek((a) => console.log(a)), // log 4 times (1,2,3,4)
  map((a) => a + 10),
  filter((a) => a % 2 === 0),
  take(2),
  toArray,
);
```

Even if you do `filter` after `map`, it doesn't matter. 2 items are extracted, (only 4 items are evaluated 1,2,3,4). Lazy functions can be found [here](https://fxts.dev/docs/index#lazy)
