---
id: getting-started
---

# Getting Started

## Introduction

FxTS is a library for functional programming using iterable/asyncIterable.
It provides users to write more declarative code, as well as to handle asynchronous data and functions.

To build the above, we have many features such as:

- Lazy evaluation
  - It is a useful way to represent large or possibly infinite enumerable data.
- Handling concurrent requests
  - It can handle multiple asynchronous requests and also control the count of requests.
- Type inference
  - Function composition can be inferred.
- Follow [iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) Iterable / AsyncIterable
  - FxTS follows the protocol of the language standard.
    This means that it matches well with existing functions and functions that will be added in the future.

## Installation

### NPM

```shell
npm install @fxts/core
```

### Yarn

```shell
yarn add @fxts/core
```

## Usage

### TypeScript

```ts
import { filter, map, pipe, range, reduce, take } from "@fxts/core";

const sum = pipe(
  range(Infinity),
  filter((a) => a % 5 === 0),
  map((a) => a * 10),
  take(10),
  reduce((a, b) => a + b),
); // typeof 'sum' inferred as the number
```

**Note: It is recommended to enable [strictFunctionTypes](https://www.typescriptlang.org/tsconfig#strictFunctionTypes), [strictNullChecks](https://www.typescriptlang.org/tsconfig#strictNullChecks) tsc option. If not, type inference does not work as we expected. For example, in the example above, `sum` is not inferred as a number type if the option is turned off.**

### JavaScript

Usage is the same as TypeScript, but there are several points to note.

#### ESM

As shown in the example code below, the module imported by default was built targeting `es2018` and **does not include polyfill**.

```javascript
import { filter, map, pipe, range, reduce, take } from "@fxts/core";
```

If JavaScript runtime you use does not support `es2018`, use `esm5` submodule instead as shown below.

```javascript
import { filter, map, pipe, range, reduce, take } from "@fxts/core/esm5";
```

#### CJS

```javascript
const { filter, map, pipe, range, reduce } = require("@fxts/core");

// It can be loaded as an individual function
const take = require("@fxts/core/Lazy/take").default;
```

**Note: `esm5` and `cjs` submodules were built targeting `es5`, and also does not include polyfill.**

### CDN

This script was built targeting `es5` and contains polyfill.

```html
<script src="https://cdn.jsdelivr.net/npm/@fxts/core/dist/fx.min.js"></script>
```
