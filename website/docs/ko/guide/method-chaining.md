# 메서드 체이닝

[pipe](/ko/api/pipe)를 통해 Iterable/AsyncIterable을 처리할 수 있지만, `fxts`는 메서드 체이닝 형태로도 데이터 변환을 제공합니다.

```ts
fx([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  .filter((a) => a % 2 === 0) // [0, 2]
  .map((a) => a * a) // [0, 4]
  .take(2) // [0, 4]
  .reduce(sum); // 4

fx("abc")
  .map((a) => a.toUpperCase()) // ["A", "B"]
  .take(2)
  .toArray(); // ["A", "B"]
```

**참고: `fx`는 기본적으로 지연 평가를 사용하므로, `toArray`, `groupBy`, `indexBy`, `some` 같은 즉시 평가 메서드가 실행될 때까지 실제로 평가되지 않습니다.**

지연 평가에 대한 자세한 내용은 /ko/guide/lazy-evaluation을 참조하세요.

### AsyncIterable 처리 지원

`fx`는 [AsyncIterator](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator) 값도 처리할 수 있습니다. 아래 예제에서는 `toAsync`를 사용하여 `AsyncIterator` 값을 생성합니다.

```ts
await fx(toAsync([1, 2, 3, 4]))
  .filter(async (a) => a % 2 === 0)
  .map(async (a) => a * a)
  .reduce(sum);

await fx([1, 2, 3, 4])
  .filter((a) => a % 2 === 0)
  .toAsync() // 비동기 함수가 반환되는 경우
  .map(async (a) => a * a)
  .reduce(sum);
```

### 동시성 처리

`fx`는 동시 작업을 지원합니다. concurrent에서 본 것처럼, concurrent는 asyncIterable에서만 사용할 수 있습니다.

`fxts`로 동시성을 처리하는 방법에 대한 자세한 내용은 /ko/guide/handle-concurrency를 참조하세요.

```ts
/**
 *
 *  평가
 *               ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
 *               │  1  │──│  2  │──│  3  │──│  4  │──│  5  │──│  6  │
 *               └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘
 *       map        │        │        │        │        │        │
 *  concurrent(2)  (1)      (1)      (2)      (2)      (3)      (3)
 *                  │        │        │        │        │        │
 *                  ▼        ▼        ▼        ▼        ▼        ▼
 */
await fx(toAsync(range(1, 7)))
  // 비동기 함수 반환
  .map(async (a) => delay(100, a))
  .concurrent(2)
  .consume(); // 약 300ms가 걸립니다.
```

### 기타

`fx`는 `fxts`의 모든 함수를 메서드로 제공하지 않습니다.

제공되지 않는 `fxts` 함수나 추가 함수를 사용하고 싶다면, `chain` 메서드를 사용할 수 있습니다.

```ts
fx([1, 2, 3, 4])
  .chain(append(5))
  .map((a) => a + 10)
  .toArray(); // [11, 12, 13, 14, 15]
```
