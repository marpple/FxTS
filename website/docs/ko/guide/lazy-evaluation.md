# 지연 평가

FxTS는 [지연 평가](https://ko.wikipedia.org/wiki/%EB%8A%90%EA%B8%8B%ED%95%9C_%EA%B3%84%EC%82%B0%EB%B2%95)를 제공합니다.
코드를 통해 지연 평가가 왜 유용한지 설명하겠습니다.

아래와 같은 코드를 자주 볼 수 있습니다. 코드를 선언적으로 작성하여 유지보수하기 쉽고 읽기 쉬운 코드를 만들고자 합니다.

```ts
const sum = (a: number, b: number) => a + b;

[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .filter((a) => a % 2 === 0)
  .map((a) => a * a)
  .reduce(sum);
```

매우 읽기 쉬워 보입니다. 이제 어떻게 동작하는지 살펴보겠습니다.

[불변성](https://ko.wikipedia.org/wiki/%EB%B6%88%EB%B3%80%EA%B0%9D%EC%B2%B4)을 유지하기 위해, 메서드가 진행될 때마다
새로운 크기의 배열이 생성되고 배열을 순회합니다.

```typescript
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .filter((a) => a % 2 === 0) // [0, 2, 4, 6, 8]
  .map((a) => a * a) // [0, 4, 16, 36, 64]
  .reduce(sum); // 120
```

모든 배열 값을 순회하기 때문에,
`slice`나 `filter`처럼 배열 크기를 줄이는 로직은 보통 앞쪽에 배치합니다
(그래야 순회 횟수를 줄일 수 있습니다).

```typescript
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .filter((a) => a % 2 === 0) // [0, 2, 4, 6, 8]
  .slice(0, 2); // [0, 2]
  .map((a) => a * a) // [0, 4]
  .reduce(sum); // 4
```

현재 배열 크기가 매우 작아서 문제가 없어 보입니다.
하지만 크기가 정말 커지면, 명령형 프로그래밍으로 돌아가야 할까요?

FxTS는 `Iterable`/`AsyncIterable`을 다루는 함수들의 조합으로 사용할 수 있으며,
이 경우 `Iterable`/`AsyncIterable`의 값을 필요한 만큼만 평가합니다.

`take(2)`(2개 값만)가 평가되고 그 이후에는 더 이상 값을 평가하지 않습니다.
또한 위 코드의 `Array.prototype.filter`는 모든 값을 순회해야 하지만,
아래 코드는 필요한 값만 평가합니다. `filter`조차도요.

```typescript
pipe(
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  filter((a) => a % 2 === 0), // [0, 2]
  map((a) => a * a), // [0, 4]
  take(2), // [0, 4]
  reduce(sum), // 4
);
```

FxTS는 대용량 또는 무한한 열거 가능한 데이터 집합을 표현하는 데 유용한 방법입니다.

```typescript
pipe(
  range(Infinity),
  filter((a) => a % 2 === 0), // [0, 2]
  map((a) => a * a), // [0, 4]
  take(2), // [0, 4]
  reduce(sum), // 4
);
```

`Lazy` 함수들의 조합은 [제너레이터](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Generator)처럼 실제 값을 평가하지 않습니다.
[for-of](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/for...of)나
[await for-of](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/for-await...of),
`Strict` 함수로 평가할 수 있습니다. `Strict` 함수는 [여기](https://fxts.dev/api#strict)에서 찾을 수 있습니다.

```typescript
const squareNums = pipe(
  range(Infinity),
  map((a) => a * a),
); // 아직 평가되지 않음

const result = pipe(
  squareNums,
  filter((a) => a % 2 === 0),
  take(10),
  toArray, // Strict 함수
);
```

Lazy 함수는 [여기](https://fxts.dev/api#lazy)에서 찾을 수 있습니다.

### 유용한 예제

아래 코드는 더 유용한 상황을 보여줍니다.

```typescript
/**
 * [{
 *   title: string,
 *   director: string,
 *   language: string,
 *   genre: string,
 *   rating: number,
 *   ...
 * }]
 */
const fetchMovie = async (year: number) =>
  fetch(`https://api.movie.xxx/${year}`);

const recommendMovie = async (year: number, rating: number) =>
  pipe(
    range(year, Infinity),
    toAsync,
    map(fetchMovie),
    map((res) => res.json()),
    filter((movie) => movie.rating >= rating),
    head,
  );

await recommendMovie(2020, 9);
```
