/**
 * Creates an object by pairing `keys` with `values` position by position.
 * Keys without a matching value get `undefined`, and extra values are
 * ignored.
 *
 * @example
 * ```ts
 * zipObject(["a", "b"], [1, 2]); // { a: 1, b: 2 }
 * zipObject(["a", "b", "c"], [1, 2]); // { a: 1, b: 2, c: undefined }
 * zipObject(["a", "b"], [1, 2, 3]); // { a: 1, b: 2 }
 * ```
 */
function zipObject<K extends PropertyKey, V>(
  keys: Iterable<K>,
  values: Iterable<V>,
): Record<K, V> {
  const result = {} as Record<K, V>;
  const iterator = values[Symbol.iterator]();
  for (const key of keys) {
    const { done, value } = iterator.next();
    result[key] = done ? (undefined as V) : value;
  }
  return result;
}

export default zipObject;
