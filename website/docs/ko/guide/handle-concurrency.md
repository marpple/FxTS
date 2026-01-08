---
description: "FxTS concurrent 유틸리티로 동시 비동기 작업을 처리하는 방법."
---

# 동시성 처리

> `concurrent`는 여러 비동기 값을 한 번에 처리할 수 있는 함수입니다.

JavaScript에는 [Promise.all](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)로 여러 promise 값을 동시에 평가하는 함수가 있습니다.
그러나 동시 요청의 부하를 처리할 수 없고 무한한 열거 가능한 데이터 집합에 대한 요청을 처리할 수 없습니다.
[concurrent](/ko/api/concurrent)는 무한 데이터 집합의 비동기 요청을 처리하고 부하의 요청 크기를 제어할 수 있습니다.

```ts
// prettier-ignore
import { pipe, toAsync, range, map, filter, take, each, concurrent } from "@fxts/core";

const fetchApi = (page) =>
  new Promise((resolve) => setTimeout(() => resolve(page), 1000));

await pipe(
  range(Infinity),
  toAsync,
  map(fetchApi), // 0,1,2,3,4,5
  filter((a) => a % 2 === 0),
  take(3), // 0,2,4
  concurrent(3), // 이 줄이 없으면 총 6초가 걸립니다.
  each(console.log), // 2초
);
```

하나씩 요청할 때 6초가 걸리지만 `concurrent`를 사용하면 2초가 걸리는 것을 확인할 수 있습니다.

### 유용한 예제

더 실용적인 코드는 아래와 같습니다.

<iframe src="https://codesandbox.io/embed/fxts-concurrent-useful-0frg2?fontsize=14&hidenavigation=1&theme=dark"
     style="height:800px; width:100%; border:0; border-radius:4px; overflow:hidden"
     title="fxts-concurrent-useful"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

위 코드에서 `concurrent`의 위치가 아래와 같다면, 결과가 달라질까요?
아닙니다, 동일합니다! `concurrent`는 항상 길이가 변경되기 전의 `Iterable`에 적용된다는 점에 유의하세요.

```ts
await pipe(
  range(Infinity),
  toAsync,
  map(fetchApi),
  concurrent(3),
  filter((a) => a % 2 === 0),
  take(3),
  each(console.log),
);
```

`map`까지 순차적으로 하나씩 평가하고,
`filter`의 비동기 predicate를 세 개씩 동시에 평가하고 싶다면, 아래 코드를 작성해야 합니다:

```ts
await pipe(
  range(Infinity),
  toAsync,
  map(fetchApi),
  toArray,
  filter((a) => delay(100, a % 2 === 0)),
  take(3),
  concurrent(3),
  each(console.log),
);
```
