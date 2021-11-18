---
id: getting-started
---

# Getting Started

## Installation

### NPM / Yarn
```shell
npm install @fxts/core
```

```shell
yarn add @fxts/core
```

## Usage

### Typescript

```ts
import { filter, map, pipe, range, reduce, take } from "@fxts/core";

const sum = pipe(
  range(Infinity),
  filter(a => a % 5 === 0),
  map(a => a * 10),
  take(10),
  reduce((a, b) => a + b)
); // typeof 'sum' inffered as the number
```

### Javascript

Usage is the same as the typescript, but there are several points to note.

#### ESM
As shown in the example code below, the module imported by default was built targeting `es2018` and **does not include polyfill**.
```javascript
import { filter, map, pipe, range, reduce, take } from "@fxts/core";
```

If Javascript runtime you use does not support `es2018`, use `esm5` submodule instead as shown below.
```javascript
import { filter, map, pipe, range, reduce, take } from "@fxts/core/esm5";
```

#### CJS
```javascript
const { filter, map, pipe, range, reduce } = require("@fxts/core");

// It can be loaded as an individual function
const take = require("@fxts/core/Lazy/take").default;
```

Note: **The `esm5` and `cjs` submodules were built with es5 targets, but also not include polyfill.**
