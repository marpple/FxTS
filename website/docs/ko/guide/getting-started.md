---
description: "FxTS 설치 및 사용 방법을 배우는 TypeScript/JavaScript 함수형 프로그래밍 라이브러리 시작 가이드."
---

# 시작하기

## 소개

FxTS는 iterable/asyncIterable을 사용한 함수형 프로그래밍을 위한 라이브러리입니다.
사용자가 더 선언적인 코드를 작성할 수 있도록 하며, 비동기 데이터와 함수를 쉽게 처리할 수 있습니다.

이를 위해 다음과 같은 기능을 제공합니다:

- 지연 평가
  - 대용량 데이터나 무한 시퀀스를 효율적으로 표현하는 데 유용합니다.
- 동시성 요청 처리
  - 여러 비동기 요청을 처리하고 요청 수를 제어할 수 있습니다.
- 타입 추론
  - 함수 합성에서 타입을 추론할 수 있습니다.
- [이터레이션 프로토콜](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Iteration_protocols) Iterable / AsyncIterable 준수
  - FxTS는 언어 표준 프로토콜을 따릅니다.
    이는 기존 함수들 및 앞으로 추가될 함수들과도 잘 호환된다는 것을 의미합니다.

## 설치

### NPM

```shell
npm install @fxts/core
```

### Yarn

```shell
yarn add @fxts/core
```

## 사용법

### TypeScript

```ts
import { filter, map, pipe, range, reduce, take } from "@fxts/core";

const sum = pipe(
  range(Infinity),
  filter((a) => a % 5 === 0),
  map((a) => a * 10),
  take(10),
  reduce((a, b) => a + b),
); // 'sum'의 타입은 number로 추론됩니다
```

**참고: [strictFunctionTypes](https://www.typescriptlang.org/tsconfig#strictFunctionTypes), [strictNullChecks](https://www.typescriptlang.org/tsconfig#strictNullChecks) tsc 옵션을 활성화하는 것을 권장합니다. 그렇지 않으면 타입 추론이 예상대로 작동하지 않습니다. 예를 들어, 위 예제에서 옵션이 꺼져 있으면 `sum`이 number 타입으로 추론되지 않습니다.**

### JavaScript

사용법은 TypeScript와 동일하지만, 몇 가지 주의할 점이 있습니다.

#### ESM

아래 예제 코드처럼, 기본적으로 import되는 모듈은 `es2018`을 대상으로 빌드되었으며 **폴리필을 포함하지 않습니다**.

```javascript
import { filter, map, pipe, range, reduce, take } from "@fxts/core";
```

사용하는 JavaScript 런타임이 `es2018`을 지원하지 않는다면, 아래와 같이 `esm5` 서브모듈을 대신 사용하세요.

```javascript
import { filter, map, pipe, range, reduce, take } from "@fxts/core/esm5";
```

#### CJS

```javascript
const { filter, map, pipe, range, reduce } = require("@fxts/core");

// 개별 함수로 로드할 수도 있습니다
const take = require("@fxts/core/Lazy/take").default;
```

**참고: `esm5`와 `cjs` 서브모듈은 `es5`를 대상으로 빌드되었으며, 마찬가지로 폴리필을 포함하지 않습니다.**

### CDN

이 스크립트는 `es5`를 대상으로 빌드되었으며 폴리필을 포함합니다.

```html
<script src="https://cdn.jsdelivr.net/npm/@fxts/core/dist/fx.min.js"></script>
```
