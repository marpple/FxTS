---
id: matches
---

## matches() function

创建一个谓词(predicate)函数,用于检查输入是否匹配给定模式的所有属性。

对嵌套对象和数组执行深度比较。
在 `find`、`filter`、`some`、`every` 中用对象模式替换回调函数时非常有用。

**Signature:**

```typescript
function matches<T>(pattern: Record<Key, any>): (input: T) => boolean;
```

## Example

```ts
const users = [
  { name: "John", age: 30, active: true },
  { name: "Jane", age: 25, active: false },
  { name: "Bob", age: 30, active: true },
];

// 与 filter 一起使用
filter(matches({ age: 30, active: true }), users);
// [{ name: "John", age: 30, active: true }, { name: "Bob", age: 30, active: true }]

// 与 find 一起使用
find(matches({ active: true }), users);
// { name: "John", age: 30, active: true }

// 与 pipe 一起使用
pipe(users, filter(matches({ active: true })), toArray);
// [{ name: "John", age: 30, active: true }, { name: "Bob", age: 30, active: true }]

// 嵌套对象匹配
const data = [
  { id: 1, user: { profile: { age: 30 } } },
  { id: 2, user: { profile: { age: 25 } } },
  { id: 3, user: { profile: { age: 30 } } },
];
filter(matches({ user: { profile: { age: 30 } } }), data);
// [{ id: 1, user: { profile: { age: 30 } } }, { id: 3, user: { profile: { age: 30 } } }]

// 数组值匹配
const items = [
  { id: 1, tags: ["a", "b"] },
  { id: 2, tags: ["c", "d"] },
  { id: 3, tags: ["a", "b"] },
];
filter(matches({ tags: ["a", "b"] }), items);
// [{ id: 1, tags: ["a", "b"] }, { id: 3, tags: ["a", "b"] }]

// 对于 null/undefined 输入返回 false
const matcher = matches({ a: 1 });
matcher(null); // false
matcher(undefined); // false
```

[Open Source Code](https://github.com/marpple/FxTS/blob/main/src/matches.ts)
