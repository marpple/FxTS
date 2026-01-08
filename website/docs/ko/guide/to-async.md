---
description: "FxTS에서 비동기 이터러블을 처리하기 위해 toAsync를 사용하는 시기와 방법."
---

# `toAsync` 함수는 언제 사용하나요?

FxTS의 많은 함수는 `Iterable`과 `AsyncIterable`을 모두 처리할 수 있습니다. 예를 들어, `find` 함수는 다음과 같이 사용할 수 있습니다.

```typescript
const numbers = function* () {
  yield 1;
  yield 2;
  yield 3;
};

const asyncNumbers = async function* () {
  yield 1;
  yield 2;
  yield 3;
};

find((num) => num === 2, numbers()); // 2
find((num) => num === 2, asyncNumbers()); // Promise<2>
```

특별히 주의할 점이 있습니다. `AsyncIterable`은 콜백 함수가 동기/비동기로 실행되든 잘 작동하지만,
**비동기 콜백 함수를 사용하여 `Iterable`을 순회하거나 `Iterable<Promise<T>>` 타입을 조작할 수 없습니다.**

```typescript
const promiseNumbers = function* () {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
  yield Promise.resolve(3);
};

find((num) => Promise.resolve(num === 2), numbers()); // 작동하지 않음
find((num) => num === 2, promiseNumbers()); // 작동하지 않음
```

FxTS를 사용하여 비동기를 처리하려면, 순회할 값이 `AsyncIterable` 타입이어야 합니다.
콜백 함수가 비동기이거나 `Iterable<Promise<T>>`를 처리해야 하는 경우, `toAsync` 함수를 사용하여 `AsyncIterable`로 변환하세요.

```typescript
await pipe(
  numbers(), // Iterable<number>
  toAsync, // AsyncIterable<number>
  find((num) => Promise.resolve(num === 2)),
);

await pipe(
  promiseNumbers(), // Iterable<Promise<number>>
  toAsync, // AsyncIterable<number>
  find((num) => Promise.resolve(num === 2)),
);
```
