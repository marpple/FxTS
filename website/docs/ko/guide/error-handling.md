# 에러 처리

에러 처리는 모든 프로그래밍에서 필수적인 부분입니다.

다른 라이브러리와 달리, FxTS의 에러 처리는 특정 에러 처리 방식을 알 필요가 없습니다.
FxTS는 표준 프로토콜을 따르기 때문에 `try-catch`로 쉽게 에러를 처리할 수 있습니다.
이는 동기/비동기 에러 전파가 가능하다는 것을 의미하므로,
[sentry](https://sentry.io/)나 다양한 서드파티 에러 로깅 및 디버깅 도구와 함께 사용하기 좋습니다.

### 동기 에러 처리

```typescript
import { map, pipe, take, toArray, toAsync } from "@fxts/core";

const syncError = (a) => {
  throw new Error(`err ${a}`);
};

try {
  pipe(
    [1, 2, 3, 4, 5],
    map(syncError),
    filter((a) => a % 2 === 0),
    toArray,
  );
} catch (err) {
  // 에러 처리
}
```

### 비동기 에러 처리

```typescript
import { filter, map, pipe, toArray, toAsync } from "@fxts/core";

const fetchAsyncError = (a) => Promise.reject(`err ${a}`);

try {
  await pipe(
    Promise.resolve([1, 2, 3, 4, 5]),
    toAsync,
    map(fetchAsyncError),
    filter((a) => a % 2 === 0),
    toArray,
  );
} catch (err) {
  // 에러 처리
}

try {
  await pipe(
    [
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
      Promise.resolve(4),
    ],
    toAsync,
    map(fetchAsyncError),
    filter((a) => a % 2 === 0),
    toArray,
  );
} catch (err) {
  // 에러 처리
}
```

### 동시성 에러 처리 (Concurrent 사용)

동시 요청 상태에서는, 이전에 에러가 발생해도 `concurrent` 요청 수만큼 `AsyncIterable`이 평가됩니다.
이는 [Promise.all](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)로 비동기 요청을 실행하는 경우와 동일합니다.
`Promise.all`은 하나가 실패해도 모두 실행됩니다.

```typescript
import { concurrent, filter, map, pipe, toArray, toAsync } from "@fxts/core";

const fetchAsyncError = (a) => {
  if (a === 3) {
    return Promise.reject(`err ${a}`);
  }
  return a;
};

try {
  await pipe(
    [
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3), // 이 항목이 평가될 때, `map` 함수가 에러를 던집니다.
      Promise.resolve(4), // 이 항목도 평가됩니다.
      Promise.resolve(5), // 이 항목부터는 평가되지 않습니다.
      Promise.resolve(6),
    ],
    toAsync,
    map(fetchAsyncError),
    filter((a) => a % 2 === 0),
    concurrent(2), // 2개씩 요청
    toArray,
  );
} catch (err) {
  // 에러 처리
}
```
