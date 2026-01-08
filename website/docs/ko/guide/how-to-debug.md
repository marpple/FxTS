---
description: "FxTS 함수형 파이프라인 디버깅을 위한 팁과 기법."
---

# 파이프라인에서 쉽게 디버깅하는 방법

## 즉시 평가

즉시 평가되는 파이프라인에서는 `tap` 함수를 사용하여 파이프라인 중간에서 값의 변화를 추적할 수 있습니다.
`tap` 함수에 대해 더 알고 싶다면 [여기](/ko/api/tap)를 참조하세요.

```typescript
pipe(
  "2021/11/25",
  (str) => str.split("/"),
  tap((a) => console.log(a)), // ['2021', '11', '25']
  (date) => date.map(Number),
  tap((a) => console.log(a)), // [2021, 11, 25]
  (date) => date.map((n) => (n === 1 ? 1 : n - 1)),
  tap((a) => console.log(a)), // [2020, 10, 24]
  (date) => new Date(...date),
);
```

## 지연 평가

아래 코드는 2000년 1월 1일부터 시작하여 13일의 금요일 목록을 생성합니다. 파이프라인의 각 함수는 `IterableIterator`를 반환하며, 이는 `toArray` 함수가 `iterable`을 순회하고 값을 평가할 때까지 아무 일도 일어나지 않는다는 것을 의미합니다.

```typescript
const addDate = (from: Date, n: number) => {
  const clone = new Date(from);
  clone.setDate(n);
  return clone;
};
const addDateFrom = (from: Date) => (n: number) => addDate(from, n);
const is13thOfFriday = (date: Date) =>
  date.getDate() === 13 && date.getDay() === 5;
const formatYYYYMMDD = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

pipe(
  range(1, Infinity),
  map(addDateFrom(new Date(2000, 0, 1))),
  filter(is13thOfFriday),
  map(formatYYYYMMDD),
  take(5),
  toArray,
  console.log,
);
// ['2000-10-13', '2001-4-13', '2001-7-13', '2002-9-13', '2002-12-13']
```

따라서, `tap` 함수를 사용하여 파이프라인 중간에 로그를 남기더라도, 실제 평가 과정을 추적하기 어렵습니다. 아마 값의 타입이 `IterableIterator`라는 것만 알 수 있을 것입니다.

```typescript
pipe(
  range(1, Infinity),
  map(addDateFrom(new Date(2000, 0, 1))),
  filter(is13thOfFriday),
  tap(console.log), // IterableIterator
  map(formatYYYYMMDD),
  tap(console.log), // IterableIterator
  take(5),
  toArray,
);
```

이 지연 평가의 진행 상황을 추적하고 싶다면, [peek](/ko/api/peek) 함수를 사용할 수 있습니다.

```typescript
pipe(
  range(1, Infinity),
  map(addDateFrom(new Date(2000, 0, 1))),
  filter(is13thOfFriday),
  peek(console.log),
  map(formatYYYYMMDD),
  peek(console.log),
  take(5),
  toArray,
);
```

[전체 코드는 여기에 있습니다.](https://codesandbox.io/s/how-to-debug-t2tmb?file=/src/index.ts)

FxTS의 지연 평가를 확인하려면 [지연 평가](/ko/guide/lazy-evaluation)를 참조하세요.
