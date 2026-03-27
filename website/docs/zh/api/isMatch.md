---
id: isMatch
---

## isMatch() function

在 `object` 和 `source` 之间执行部分深度比较(partial deep comparison),确定 `object` 是否包含 `source` 的所有属性值。

用作 `matches` 函数的内部比较逻辑。
`source` 只需要匹配 `object` 属性的子集即可。

支持的类型:原始类型、Object(包括嵌套)、Array、Date、RegExp、Map、Set。

**Signature:**

```typescript
function isMatch(object: unknown, source: unknown): boolean;
```

## Example

```ts
// 部分对象匹配
isMatch({ a: 1, b: 2 }, { a: 1 }); // true
isMatch({ a: 1 }, { a: 1, b: 2 }); // false - object 缺少 'b'

// 嵌套对象匹配
isMatch({ user: { name: "John", age: 30 } }, { user: { name: "John" } }); // true
isMatch({ user: { name: "John" } }, { user: { name: "Jane" } }); // false

// 数组匹配(必须完全匹配)
isMatch([1, 2, 3], [1, 2, 3]); // true
isMatch([1, 2, 3], [1, 2]); // true
isMatch([1, 2], [1, 2, 3]); // false

// 特殊类型匹配
const now = Date.now();
isMatch(new Date(now), new Date(now)); // true
isMatch(/abc/gi, /abc/gi); // true

// 空 source 始终返回 true
isMatch({ a: 1, b: 2 }, {}); // true
```

[Open Source Code](https://github.com/marpple/FxTS/blob/main/src/isMatch.ts)
