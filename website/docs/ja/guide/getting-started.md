# はじめに

## 紹介

FxTS は、iterable/asyncIterable を使用した関数型プログラミングのためのライブラリです。
より宣言的なコードを書くことができ、非同期データや関数を簡単に処理できます。

これを実現するために、以下の機能を提供しています：

- 遅延評価
  - 大量のデータや無限シーケンスを効率的に表現するのに役立ちます。
- 並行リクエストの処理
  - 複数の非同期リクエストを処理し、リクエスト数を制御できます。
- 型推論
  - 関数合成で型を推論できます。
- [イテレーションプロトコル](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Iteration_protocols) Iterable / AsyncIterable に準拠
  - FxTS は言語標準のプロトコルに従います。
    これは既存の関数や将来追加される関数とも相性が良いことを意味します。

## インストール

### NPM

```shell
npm install @fxts/core
```

### Yarn

```shell
yarn add @fxts/core
```

## 使い方

### TypeScript

```ts
import { filter, map, pipe, range, reduce, take } from "@fxts/core";

const sum = pipe(
  range(Infinity),
  filter((a) => a % 5 === 0),
  map((a) => a * 10),
  take(10),
  reduce((a, b) => a + b),
); // 'sum'の型はnumberと推論されます
```

**注意: [strictFunctionTypes](https://www.typescriptlang.org/tsconfig#strictFunctionTypes)、[strictNullChecks](https://www.typescriptlang.org/tsconfig#strictNullChecks) tsc オプションを有効にすることをお勧めします。有効にしないと、型推論が期待通りに動作しません。例えば、上記の例では、オプションがオフの場合、`sum`は number 型として推論されません。**

### JavaScript

使い方は TypeScript と同じですが、いくつか注意点があります。

#### ESM

以下のサンプルコードのように、デフォルトでインポートされるモジュールは`es2018`をターゲットにビルドされており、**ポリフィルは含まれていません**。

```javascript
import { filter, map, pipe, range, reduce, take } from "@fxts/core";
```

使用する JavaScript ランタイムが`es2018`をサポートしていない場合は、以下のように`esm5`サブモジュールを代わりに使用してください。

```javascript
import { filter, map, pipe, range, reduce, take } from "@fxts/core/esm5";
```

#### CJS

```javascript
const { filter, map, pipe, range, reduce } = require("@fxts/core");

// 個別の関数としてロードすることもできます
const take = require("@fxts/core/Lazy/take").default;
```

**注意: `esm5`と`cjs`サブモジュールは`es5`をターゲットにビルドされており、同様にポリフィルは含まれていません。**

### CDN

このスクリプトは`es5`をターゲットにビルドされており、ポリフィルを含んでいます。

```html
<script src="https://cdn.jsdelivr.net/npm/@fxts/core/dist/fx.min.js"></script>
```
