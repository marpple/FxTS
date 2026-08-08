# p-limit / p-map에서 마이그레이션

컬렉션에 동시성 제한을 걸어 비동기 작업을 실행하기 위해 `p-map`이나 `p-limit`을
사용하고 있다면, FxTS의 `concurrentPool`이 같은 일을 해냅니다 — 여기에 배열 기반
매퍼로는 표현할 수 없는 스트리밍, 조기 종료, AsyncIterable 소스까지 더해집니다.

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

`concurrentPool`은 `p-map`과 동일한 의미론을 가집니다: 최대 `n`개의 작업이 실행
중인 풀에서 하나가 끝나는 즉시 다음 작업이 시작되고, 결과는 입력 순서대로
반환되며, 첫 번째 실패가 실행을 중단시킵니다.

**마이그레이션할 때는 `concurrent`가 아니라 `concurrentPool`을 선택하세요.**
`concurrent`는 `n`개 단위의 고정 윈도우로 평가하며(이전 윈도우가 끝나야 다음
윈도우가 시작), 배치 의미론이 필요할 때는 유용하지만 작업 시간이 불균일한
워크로드에서는 `p-map` 방식의 풀과 처리량 특성이 다릅니다.

## 컬렉션에 대한 p-limit → concurrentPool

가장 흔한 `p-limit` 패턴 — 매핑된 컬렉션에 제한을 거는 것 — 도 같은 방식으로
마이그레이션됩니다:

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

## 대응되지 않는 것

경계를 정직하게 말하면:

- **공유되는 ad-hoc 리미터** — 하나의 `limit` 인스턴스로 코드베이스 곳곳의 서로
  무관한 호출을 제한하는 패턴 — 는 파이프라인 라이브러리가 모델링하는 대상이
  아닙니다. 그 용도로는 `p-limit`을 유지하세요.
- **`stopOnError: false`** (`AggregateError`로 수집)의 직접 대응물은 없습니다.
  FxTS는 첫 에러를 전파합니다. 결과를 수집하려면 매퍼에서 결과 객체를 반환하세요:
  `map(async (url) => fetchItem(url).then((v) => ({ ok: true as const, v }), (e) => ({ ok: false as const, e })))`.
- **`AbortSignal`** 옵션은 받지 않습니다. 일반적인 경우는 lazy 특성이 커버합니다:
  소비를 멈추면 파이프라인도 멈춥니다.

## p-map 대비 얻는 것

전체 배열을 기다리지 않고 결과를 **스트림으로 소비**할 수 있습니다:

```typescript
import { concurrentPool, each, map, pipe, toAsync } from "@fxts/core";

await pipe(
  toAsync(urls),
  map((url) => fetchItem(url)),
  concurrentPool(5),
  each((item) => render(item)), // 결과가 도착하는 대로, 순서대로 처리
);
```

파이프라인은 **조기 종료**됩니다 — `take`와 결합하면 충분히 모인 시점에 작업
스케줄링 자체가 멈춥니다:

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
  take(3), // 3개를 얻으면 당기기를 멈추고, 남은 작업은 시작되지 않습니다
  toArray,
);
```

그리고 소스가 배열일 필요가 없습니다 — 어떤 `AsyncIterable`이든 동작하므로
(페이지네이션 API, 스트림), 전체 입력을 메모리에 실체화할 필요가 없습니다.
