---
description: "FxTS의 pipe와 pipeLazy를 사용한 함수 합성으로 깔끔하고 읽기 쉬운 코드 작성하기."
---

# 함수 합성

[pipe](/ko/api/pipe)에 대해 소개하겠습니다.

`pipe`라는 함수는 이미 여러 라이브러리에서 제공하고 있어서 익숙할 수 있습니다.

- [lodash](https://lodash.com/)의 flow
- [ramda](https://ramdajs.com/)의 pipe
- [rxjs](https://rxjs.dev/)의 pipe

`pipe`는 함수의 출력을 다른 함수의 인자로 전달하여 함수들을 연결하는 함수입니다.

`pipe`가 왜 필요한지 잠시 살펴보겠습니다.

배열이 있고, 이 배열에 `filter` -> `map` -> `reduce`를 수행하여 최종 결과를 얻고 싶다고 가정해봅시다.

```typescript
const sum = (a: number, b: number) => a + b;
const arr = [1, 2, 3, 4, 5];
// filter
// map
// reduce
```

모든 코드가 순수 함수이므로 함수 합성을 만들기 쉽지만, 읽기가 매우 어려워 보입니다.

```typescript
reduce(
  sum,
  map(
    (a) => a + 10,
    filter((a) => a % 2 === 0, arr);
  ),
)
```

위 문제를 해결하기 위해 `pipe`를 제공합니다.

```typescript
import { filter, map, pipe, reduce } from "@fxts/core";

pipe(
  arr,
  filter((a) => a % 2 === 0),
  map((a) => a + 10),
  reduce(sum),
);
```

`pipe`와 함께 사용하면 읽기 쉬워 보입니다.

> `Array.prototype.[Function]`과의 비교는 [이 문서](/ko/guide/lazy-evaluation)를 확인하세요.

<br/>

또한, `Promise` 값을 직접 다룰 필요가 없습니다.

```typescript
await pipe(
  Promise.resolve(1),
  (a /*: Awaited<number>*/) => a + 1,
  async (b /*: Awaited<number>*/) => b + 1,
  (c /*: Awaited<number>*/) => c + 1,
); // 4
```

- a : `a`는 number로 추론되며, 실제 값도 `Promise<number>`가 아닌 number입니다.
- c : 이전 함수가 비동기 함수여도 인자는 `Promise<number>`가 아닙니다.

비동기 값을 직접 다루지 않는다고 해서 에러 발생 시 처리할 수 없는 것은 아닙니다.
에러 처리에 대해서는 [에러 처리](/ko/guide/error-handling)를 확인하세요.
