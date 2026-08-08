# Migrate from p-limit / p-map

If you use `p-map` or `p-limit` to run async work with a concurrency limit over a
collection, FxTS covers the same job with `concurrentPool` — plus streaming,
early termination, and AsyncIterable sources that array-based mappers cannot
express.

## p-map → concurrentPool

```typescript
// p-map
import pMap from "p-map";
const results = await pMap(urls, (url) => fetchItem(url), { concurrency: 5 });

// FxTS
import { concurrentPool, map, pipe, toArray, toAsync } from "@fxts/core";
const results = await pipe(
  toAsync(urls),
  map((url) => fetchItem(url)),
  concurrentPool(5),
  toArray,
);
```

`concurrentPool` has the same semantics as `p-map`: a pool of at most `n`
in-flight tasks where a new task starts as soon as one settles, results in input
order, and the first rejection aborts the run.

**Pick `concurrentPool`, not `concurrent`, when migrating.** `concurrent`
evaluates in fixed windows of `n` (the next window starts after the previous one
finishes), which is useful for batch semantics but has different throughput
characteristics than a `p-map`-style pool on uneven workloads.

## p-limit over a collection → concurrentPool

The common `p-limit` pattern — limiting a mapped collection — is the same
migration:

```typescript
// p-limit
import pLimit from "p-limit";
const limit = pLimit(5);
const results = await Promise.all(ids.map((id) => limit(() => loadUser(id))));

// FxTS
const results = await pipe(
  toAsync(ids),
  map((id) => loadUser(id)),
  concurrentPool(5),
  toArray,
);
```

## What does not map

Being honest about the boundaries:

- **A shared ad-hoc limiter** — one `limit` instance throttling unrelated call
  sites across a codebase — is not what a pipeline library models. Keep
  `p-limit` for that.
- **`stopOnError: false`** (collecting an `AggregateError`) has no direct
  equivalent; FxTS propagates the first error. To collect outcomes instead,
  return result objects from the mapper:
  `map(async (url) => fetchItem(url).then((v) => ({ ok: true as const, v }), (e) => ({ ok: false as const, e })))`.
- **`AbortSignal`** is not taken as an option. Laziness covers the usual cases:
  stopping consumption stops the pipeline.

## What you gain over p-map

Results can be **consumed as a stream** instead of waiting for the whole array:

```typescript
import { concurrentPool, each, map, pipe, toAsync } from "@fxts/core";

await pipe(
  toAsync(urls),
  map((url) => fetchItem(url)),
  concurrentPool(5),
  each((item) => render(item)), // handled as each result arrives, in order
);
```

Pipelines **terminate early** — combine with `take` to stop scheduling work once
you have enough:

```typescript
import {
  concurrentPool,
  filter,
  map,
  pipe,
  take,
  toArray,
  toAsync,
} from "@fxts/core";

const firstThree = await pipe(
  toAsync(candidates),
  map((c) => probe(c)),
  concurrentPool(5),
  filter((r) => r.alive),
  take(3), // stops pulling once three passed - remaining work is not started
  toArray,
);
```

And the source does not have to be an array — any `AsyncIterable` works
(paginated APIs, streams), so the whole input never needs to be materialized.
