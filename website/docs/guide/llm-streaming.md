# Process LLM Token Streams

Every major LLM SDK returns its stream as an **AsyncIterable** — the standard
JavaScript iteration protocol. FxTS is built directly on that same protocol
(Iterable/AsyncIterable), which makes it the natural pipeline layer for LLM
output: no adapters, no wrappers — an SDK stream is already a FxTS source.

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { each, filter, map, pipe } from "@fxts/core";

const client = new Anthropic();

const stream = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Write a haiku about iterators" }],
  stream: true,
});

// The stream speaks the AsyncIterable protocol - pipe consumes it as-is
await pipe(
  stream,
  filter((event) => event.type === "content_block_delta"),
  map((event) => ("text" in event.delta ? event.delta.text : "")),
  each((text) => process.stdout.write(text)),
);
```

The `filter` narrows the event union without an explicit type guard — on
TypeScript 5.5+ the predicate is inferred, so `map` receives only
`content_block_delta` events.

## Stop generating work when you have enough

Laziness means downstream decides when to stop pulling. Cut off processing at
a semantic boundary — the rest of the stream is simply never consumed:

```typescript
import { filter, map, pipe, takeUntilInclusive, toArray } from "@fxts/core";

// Collect only the first paragraph of the answer
const firstParagraph = await pipe(
  stream,
  filter((event) => event.type === "content_block_delta"),
  map((event) => ("text" in event.delta ? event.delta.text : "")),
  takeUntilInclusive((text) => text.includes("\n\n")),
  toArray,
).then((chunks) => chunks.join("").split("\n\n")[0]);
```

## Fan out prompts with a bounded pool

Rate limits make unbounded `Promise.all` a bad idea. `concurrentPool` keeps at
most `n` requests in flight, starts the next one the moment one settles, and
yields results in input order:

```typescript
import { concurrentPool, map, pipe, toArray, toAsync } from "@fxts/core";

const summarize = async (doc: string): Promise<string> => {
  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 256,
    messages: [{ role: "user", content: `Summarize:\n\n${doc}` }],
  });
  return message.content[0].type === "text" ? message.content[0].text : "";
};

const summaries = await pipe(
  toAsync(documents),
  map(summarize),
  concurrentPool(3), // at most 3 requests in flight, results in input order
  toArray,
);
```

Because pipelines terminate early, combining this with `take` stops
_scheduling_ requests once you have enough results — unstarted calls are never
made, and never billed.

## One protocol, every source

The same pipelines work over anything that speaks the iteration protocol:

- **LLM SDK streams** — OpenAI and Anthropic streams are `AsyncIterable`
- **Node.js streams** — `Readable` implements `AsyncIterable`
- **Web streams** — `ReadableStream` is async-iterable in modern runtimes
- **Paginated APIs** — wrap the paging loop in an async generator and the
  whole result set becomes one lazy sequence

FxTS does not invent its own stream abstraction to learn — it composes the one
the platform, and every LLM SDK, already uses.

See also:

- [Handle Concurrency](/guide/handle-concurrency) — `concurrent` vs `concurrentPool` in depth
- [Migrate from p-limit/p-map](/guide/migrate-from-p-map) — moving existing pooled-concurrency code to FxTS
