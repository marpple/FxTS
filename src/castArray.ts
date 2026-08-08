/**
 * Casts `value` as an array if it's not one.
 * If `value` is already an array, the same reference is returned as-is.
 * `null` and `undefined` are wrapped like any other value.
 *
 * @example
 * ```ts
 * castArray(1); // [1]
 * castArray("a"); // ["a"]
 * castArray({ a: 1 }); // [{ a: 1 }]
 * castArray(null); // [null]
 * castArray(undefined); // [undefined]
 *
 * const arr = [1, 2, 3];
 * castArray(arr) === arr; // true - same reference
 * ```
 */
function castArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export default castArray;
