# LLM 토큰 스트림 처리

모든 주요 LLM SDK는 스트림을 **AsyncIterable** — 표준 JavaScript 이터레이션
프로토콜 — 로 반환합니다. FxTS는 바로 그 프로토콜(Iterable/AsyncIterable) 위에
직접 구축된 라이브러리라서, LLM 출력의 파이프라인 계층으로 자연스럽게 맞물립니다:
어댑터도 래퍼도 없이, SDK 스트림이 곧 FxTS의 소스입니다.

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

// 스트림은 AsyncIterable 프로토콜을 말합니다 - pipe가 그대로 소비합니다
await pipe(
  stream,
  filter((event) => event.type === "content_block_delta"),
  map((event) => ("text" in event.delta ? event.delta.text : "")),
  each((text) => process.stdout.write(text)),
);
```

`filter`가 명시적 타입 가드 없이 이벤트 유니온을 좁힙니다 — TypeScript 5.5+에서는
술어가 자동 추론되어, `map`은 `content_block_delta` 이벤트만 받습니다.

## 충분히 얻었으면 생성 작업도 멈추기

지연 평가에서는 다운스트림이 언제 당기기를 멈출지 결정합니다. 의미 있는 경계에서
처리를 끊으면, 스트림의 나머지는 아예 소비되지 않습니다:

```typescript
import { filter, map, pipe, takeUntilInclusive, toArray } from "@fxts/core";

// 답변의 첫 문단만 수집
const firstParagraph = await pipe(
  stream,
  filter((event) => event.type === "content_block_delta"),
  map((event) => ("text" in event.delta ? event.delta.text : "")),
  takeUntilInclusive((text) => text.includes("\n\n")),
  toArray,
).then((chunks) => chunks.join("").split("\n\n")[0]);
```

## 제한된 풀로 프롬프트 팬아웃

레이트 리밋 아래에서 무제한 `Promise.all`은 나쁜 선택입니다. `concurrentPool`은
최대 `n`개의 요청만 동시에 유지하고, 하나가 끝나는 즉시 다음을 시작하며, 결과를
입력 순서대로 내보냅니다:

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
  concurrentPool(3), // 최대 3개 요청만 동시 실행, 결과는 입력 순서대로
  toArray,
);
```

파이프라인은 조기 종료되므로, `take`와 결합하면 충분한 결과를 얻은 시점에 요청
_스케줄링_ 자체가 멈춥니다 — 시작되지 않은 호출은 실행되지도, 과금되지도 않습니다.

## 하나의 프로토콜, 모든 소스

같은 파이프라인이 이터레이션 프로토콜을 말하는 모든 것 위에서 동작합니다:

- **LLM SDK 스트림** — OpenAI와 Anthropic 스트림은 `AsyncIterable`입니다
- **Node.js 스트림** — `Readable`은 `AsyncIterable`을 구현합니다
- **웹 스트림** — 모던 런타임에서 `ReadableStream`은 async-iterable입니다
- **페이지네이션 API** — 페이징 루프를 async 제너레이터로 감싸면 전체 결과가
  하나의 지연 시퀀스가 됩니다

FxTS는 배워야 할 자체 스트림 추상화를 발명하지 않습니다 — 플랫폼과 모든 LLM
SDK가 이미 쓰고 있는 그 프로토콜을 조합할 뿐입니다.
