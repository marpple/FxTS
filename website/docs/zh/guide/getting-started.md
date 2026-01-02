# 快速开始

## 介绍

FxTS 是一个使用 iterable/asyncIterable 进行函数式编程的库。
它允许用户编写更具声明性的代码，并轻松处理异步数据和函数。

为此，我们提供以下功能：

- 惰性求值
  - 对于表示大量数据或无限序列非常有用。
- 并发请求处理
  - 可以处理多个异步请求并控制请求数量。
- 类型推断
  - 可以推断函数组合中的类型。
- 遵循[迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols) Iterable / AsyncIterable
  - FxTS 遵循语言标准协议。
    这意味着它与现有函数以及将来添加的函数都能很好地兼容。

## 安装

### NPM

```shell
npm install @fxts/core
```

### Yarn

```shell
yarn add @fxts/core
```

## 使用方法

### TypeScript

```ts
import { filter, map, pipe, range, reduce, take } from "@fxts/core";

const sum = pipe(
  range(Infinity),
  filter((a) => a % 5 === 0),
  map((a) => a * 10),
  take(10),
  reduce((a, b) => a + b),
); // 'sum' 的类型被推断为 number
```

**注意：建议启用 [strictFunctionTypes](https://www.typescriptlang.org/tsconfig#strictFunctionTypes)、[strictNullChecks](https://www.typescriptlang.org/tsconfig#strictNullChecks) tsc 选项。否则，类型推断将无法按预期工作。例如，在上面的示例中，如果选项关闭，`sum` 不会被推断为 number 类型。**

### JavaScript

使用方法与 TypeScript 相同，但有几点需要注意。

#### ESM

如下面的示例代码所示，默认导入的模块是针对 `es2018` 构建的，**不包含 polyfill**。

```javascript
import { filter, map, pipe, range, reduce, take } from "@fxts/core";
```

如果使用的 JavaScript 运行时不支持 `es2018`，请使用 `esm5` 子模块代替，如下所示。

```javascript
import { filter, map, pipe, range, reduce, take } from "@fxts/core/esm5";
```

#### CJS

```javascript
const { filter, map, pipe, range, reduce } = require("@fxts/core");

// 也可以作为单独的函数加载
const take = require("@fxts/core/Lazy/take").default;
```

**注意：`esm5` 和 `cjs` 子模块是针对 `es5` 构建的，同样不包含 polyfill。**

### CDN

此脚本是针对 `es5` 构建的，并包含 polyfill。

```html
<script src="https://cdn.jsdelivr.net/npm/@fxts/core/dist/fx.min.js"></script>
```
